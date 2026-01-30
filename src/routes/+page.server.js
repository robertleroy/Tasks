import * as auth from "$lib/server/auth";
import { db } from "$lib/server/db";
import { lists } from "$lib/server/db/schema";
import { fail } from "@sveltejs/kit";
import { eq, sql } from "drizzle-orm";

export const actions = {
  createList: async ({ request, locals }) => {
    const user = locals.user;

    const formData = await request.formData();
    const name = formData.get("name");

    const newListId = crypto.randomUUID().slice(-12);

    if (!name || name.length < 3) {
      return fail(400, { message: "Name is required" });
    }

    try {
      // Get current count to set the next position
      const result = await db
        .select({ count: sql`count(*)` })
        .from(lists)
        .where(eq(lists.userId, user.id));

      const nextPosition = result[0].count;

      await db.insert(lists).values({
        id: newListId,
        userId: user.id,
        name: name.toString(),
        position: nextPosition,
      });

      return { success: true, id: newListId };
    } catch (err) {
      console.error(err);
      return fail(500, { message: "Database error" });
    }
  },

  logout: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }

    await auth.invalidateSession(event.locals.session.id);
    auth.deleteSessionTokenCookie(event);

    return {
      success: true,
      loggedout: true,
    };
  },
};
