import { db } from "$lib/server/db";
import { listItems } from "$lib/server/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { json } from "@sveltejs/kit";

export const PATCH = async ({ request, locals }) => {
  if (!locals.user) return json({ message: "Unauthorized" }, { status: 401 });

  const { id, name, checked } = await request.json();

  await db.update(listItems).set({ name, checked }).where(eq(listItems.id, id));

  return json({ success: true });
};

export async function POST({ request }) {
  const { listId, afterPosition } = await request.json();

  const id = crypto.randomUUID().slice(-12);
  const newPosition = afterPosition + 1;

  try {
    // 1. Create the "hole" (Shift items down)
    await db
      .update(listItems)
      .set({
        // Use the column object directly in the template literal
        activePosition: sql`active_position + 1`,
      })
      .where(and(eq(listItems.listId, listId), gte(listItems.activePosition, newPosition)));

    // 2. Insert the complete record
    await db.insert(listItems).values({
      id,
      listId,
      name: "", // Empty string for the new input
      checked: false,
      activePosition: newPosition,
      checkedPosition: newPosition, // Keeps it simple
    });

    // 3. Return the ID for the frontend focus logic
    return json({ id });
  } catch (error) {
    console.error("Failed to insert item:", error);
    return new Response(undefined, { status: 500 });
  }
}

export const DELETE = async ({ request, locals }) => {
  if (!locals.user) return json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();

  await db.delete(listItems).where(eq(listItems.id, id));

  return json({ success: true });
};
