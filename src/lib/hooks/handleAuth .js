import * as auth from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { config } from '$lib';

export const handleAuth = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get(config.cookieNames.session);
  const pathname = event.url.pathname;
  
  if (!sessionToken) {
    event.locals.user = null;
    event.locals.session = null;
    
    if (pathname !== "/auth") {
      throw redirect(303, "/auth");
    }
    return resolve(event);
  }
  
  const { session, user } = await auth.validateSessionToken(sessionToken);
  if (session) {
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
  } else {
    auth.deleteSessionTokenCookie(event);
  }
  
  event.locals.user = user;
  event.locals.session = session;
  return resolve(event);
};