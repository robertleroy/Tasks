// src/routes/api/lists/+server.js (New file for general list ops)
import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { lists } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";

/* ===========================================*/

export const PATCH = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: "Unauthorized" }, { status: 401 });

  const { id, name } = await request.json();

  try {
    await db
      .update(lists)
      .set({ name })
      .where(and(eq(lists.id, id), eq(lists.userId, user.id)));

    return json({ success: true });
  } catch (err) {
    return json({ error: "Update failed" }, { status: 500 });
  }
};

/* ===========================================*/

export const DELETE = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();

  try {
    await db.delete(lists).where(and(eq(lists.id, id), eq(lists.userId, user.id)));

    return json({ success: true });
  } catch (err) {
    return json({ error: "Failed to delete" }, { status: 500 });
  }
};
