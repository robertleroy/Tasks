/* Auth.js - January 2026 */
import { eq, lt } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { config } from "$lib";

// UNITS
const DAY_IN_MS = 1000 * 60 * 60 * 24;
const HOURS_IN_MS = 1000 * 60 * 60;
const MINUTE_IN_MS = 1000 * 60;
// SET VARIABLE HERE
const EXPIRATION_MS = DAY_IN_MS * 14; 
const RENEW_MS = DAY_IN_MS * 7;

export const argon2Params = {
  // recommended minimum parameters
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};


export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);

	return token;
}

export async function createSession(token, userId) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + EXPIRATION_MS)
	};
	await db.insert(table.session).values(session);
	return session;
}


export async function validateSessionToken(token) {
  
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  // Clean up expired sessions 1% of the time
  if (Math.random() < 0.01) {
      // We don't 'await' this so the user doesn't feel the lag
      db.delete(table.session)
        .where(lt(table.session.expiresAt, new Date()))
        .execute()
        .catch(err => console.error("Session GC failed:", err));
  }


	const [result] = await db.select({
		// Adjust user table here to tweak returned data
		user: {
			id: table.user.id,
			username: table.user.username
		},
		session: table.session
	})
  .from(table.session)
  .innerJoin(table.user, eq(table.session.userId, table.user.id))
  .where(eq(table.session.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}

	const { session, user } = result;
	const sessionExpired = Date.now() >= session.expiresAt.getTime();

	if (sessionExpired) {
		await db
      .delete(table.session)
      .where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - RENEW_MS;

	if (renewSession) {
		session.expiresAt = new Date(Date.now() + EXPIRATION_MS);
		await db
      .update(table.session)
      .set({ expiresAt: session.expiresAt })
      .where(eq(table.session.id, session.id));
	}
	return { session, user };
}

export async function invalidateSession(sessionId) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
}

export function setSessionTokenCookie(event, token, expiresAt) {
	event.cookies.set(config.cookieNames.session, token, { 
		expires: expiresAt,  // unset is per session
		path: '/',
    secure: true,
    httpOnly: true,
    sameSite: "lax",
  });
}

export function deleteSessionTokenCookie(event) {
	event.cookies.delete(config.cookieNames.session, { 
    path: '/' 
  });
}


export function validateUsername(username) {
  return (
    typeof username === 'string' &&
    /^[a-zA-Z0-9_]{3,20}$/.test(username)
    // "3-20 letters, numbers, underscore"
  );
}

export function validatePassword(password) {
  return (
    typeof password === 'string' &&
    /^[a-zA-Z0-9!@#$%^&*]{4,}$/.test(password)
    // "4 or more, letters, numbers, !@#$%^&*"
  );
}