import { hash, verify } from "@node-rs/argon2";
import { encodeBase32LowerCase } from "@oslojs/encoding";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as auth from "$lib/server/auth";
import * as table from "$lib/server/db/schema";

export const load = async (event) => {
  if (event.locals.user) {
    throw redirect(302, "/account");
  }
  return { locals: event.locals };
};

export const actions = {
  login: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username").trim();
    const password = formData.get("password").trim();

    if (!auth.validateUsername(username) || !auth.validatePassword(password)) {
      return fail(400, { message: "incorrect username or password" });
    }

    const results = await db.select().from(table.user).where(eq(table.user.username, username));

    const existingUser = results.at(0);

    if (!existingUser) {
      return fail(400, { message: "incorrect username or password" });
    }

    const validPassword = await verify(existingUser.passwordHash, password, auth.argon2Params);

    if (!validPassword) {
      return fail(400, { message: "incorrect username or password" });
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingUser.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return {
      success: true,
      loggedin: true,
      username: username,
    };
  },
  register: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username").trim();
    const password = formData.get("password").trim();

    if (!auth.validateUsername(username)) {
      return fail(400, {
        message: "invalid username:",
        detail: "3-20 letters, numbers, underscore",
      });
    }
    if (!auth.validatePassword(password)) {
      return fail(400, { message: "invalid password:", detail: "4+ letters, numbers, !@#$%^&*" });
    }

    const results = await db.select().from(table.user).where(eq(table.user.username, username));

    const existingUser = results.at(0);

    if (existingUser) {
      return fail(400, { message: "username taken" });
    }

    const userId = generateUserId();
    const passwordHash = await hash(password, auth.argon2Params);

    try {
      /* INSERT USER */
      await db.insert(table.user).values({ id: userId, username, passwordHash });

      const sessionToken = auth.generateSessionToken();
      const session = await auth.createSession(sessionToken, userId);
      auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

      // select "id", "username", "password_hash" from "user" where "user"."username" = ?
      return {
        success: true,
        registered: true,
        username,
      };
    } catch {
      return fail(500, { message: "an error has occurred" });
    }
  },
};

function generateUserId() {
  // ID with 120 bits of entropy, or about the same as UUID v4.
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}
