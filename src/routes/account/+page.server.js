import { hash, verify } from "@node-rs/argon2";
import { encodeBase32LowerCase } from "@oslojs/encoding";

import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as auth from "$lib/server/auth";
import * as table from "$lib/server/db/schema";
import { cookieNames } from "$lib";
import { getRequestEvent } from "$app/server";

export const load = async (event) => {
  const user = requireLogin();
  return { user };
};

export const actions = {
  editName: async (event) => {
    const formData = await event.request.formData();
    const userid = formData.get("userid");
    const username = formData.get("username").trim();

    if (!auth.validateUsername(username)) {
      return fail(400, {
        message: "invalid username:",
        detail: "3-20 letters, numbers, underscore",
      });
    }

    try {
      /* UPDATE USERNAME */
      await db.update(table.user).set({ username }).where(eq(table.user.id, userid));
    } catch {
      return fail(500, { message: "an error has occurred" });
    }
  },

  verifyPassword: async (event) => {
    const formData = await event.request.formData();
    const userId = formData.get("userid");
    const currentPassword = formData.get("currentPassword").trim();

    const results = await db.select().from(table.user).where(eq(table.user.id, userId));

    const existingUser = results.at(0);
    const validPassword = await verify(existingUser.passwordHash, currentPassword, auth.argon2Params);

    if (!validPassword) {
      return fail(400, { message: "invalid" });
    }
    return { verified: true };
  },

  editPassword: async (event) => {
    const formData = await event.request.formData();
    const userid = formData.get("userid");
    const password = formData.get("newPassword").trim();
    const confirmPassword = formData.get("confirmPassword").trim();

    if (!auth.validatePassword(password)) {
      return fail(400, { message: "invalid password:", detail: "4+ letters, numbers, !@#$%^&*" });
    }

    if (password !== confirmPassword) {
      return fail(400, { message: "invalid password:", detail: "passwords must match" });
    }

    const passwordHash = await hash(password, auth.argon2Params);

    try {
      /* UPDATE PASSWORD */
      await db.update(table.user).set({ passwordHash }).where(eq(table.user.id, userid));
    } catch {
      return fail(500, { message: "an error has occurred" });
    }
    return { message: "", verified: false };
  },

  deleteAccount: async (event) => {
    const formData = await event.request.formData();
    const userid = formData.get("userid");
    const username = formData.get("username");

    try {
      await auth.invalidateSession(event.locals.session.id);

      await auth.deleteSessionTokenCookie(event);

      console.log("deleted", username);

      await db.delete(table.user).where(eq(table.user.id, userid));

      return {
        success: true,
        id: userid,
        username,
      };
    } catch (err) {
      return fail(500, { message: "an error has occurred" });
    }
  },
};

function requireLogin() {
  const { locals } = getRequestEvent();

  if (!locals.user) {
    return redirect(302, "/demo/lucia/login");
  }

  return locals.user;
}
