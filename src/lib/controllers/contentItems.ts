"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ContentItem, ContentItemInput } from "@/lib/cms-types";
import { runAction, type ActionResult } from "./result";

export async function listContentItemsBySection(
  sectionId: string
): Promise<ActionResult<ContentItem[]>> {
  return runAction(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("content_items")
      .select("*")
      .eq("section_id", sectionId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data as ContentItem[];
  });
}

export async function createContentItem(
  pageSlug: string,
  sectionId: string,
  input: ContentItemInput
): Promise<ActionResult<ContentItem>> {
  return runAction(async () => {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("content_items")
      .insert({ ...input, section_id: sectionId })
      .select("*")
      .single();

    if (error) throw error;

    revalidatePath(`/admin/dashboard/${pageSlug}`);
    return data as ContentItem;
  });
}

export async function updateContentItem(
  pageSlug: string,
  itemId: string,
  input: Partial<ContentItemInput>
): Promise<ActionResult<ContentItem>> {
  return runAction(async () => {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("content_items")
      .update(input)
      .eq("id", itemId)
      .select("*")
      .single();

    if (error) throw error;

    revalidatePath(`/admin/dashboard/${pageSlug}`);
    return data as ContentItem;
  });
}

export async function deleteContentItem(
  pageSlug: string,
  itemId: string
): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from("content_items").delete().eq("id", itemId);
    if (error) throw error;

    revalidatePath(`/admin/dashboard/${pageSlug}`);
    return { id: itemId };
  });
}

/**
 * Swaps `order_index` between an item and its previous/next sibling — the
 * up/down move buttons in the admin list call this rather than resending
 * the whole list on every click. `siblingIds` is that section's current
 * items in display order, as already loaded by the page.
 */
export async function moveContentItem(
  pageSlug: string,
  itemId: string,
  direction: "up" | "down",
  siblingIds: string[]
): Promise<ActionResult<null>> {
  return runAction(async () => {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();

    const index = siblingIds.indexOf(itemId);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || swapIndex < 0 || swapIndex >= siblingIds.length) {
      return null;
    }
    const swapId = siblingIds[swapIndex];

    const { data: rows, error: readError } = await supabase
      .from("content_items")
      .select("id, order_index")
      .in("id", [itemId, swapId]);
    if (readError) throw readError;

    const current = rows?.find((row) => row.id === itemId);
    const sibling = rows?.find((row) => row.id === swapId);
    if (!current || !sibling) return null;

    const { error: updateAError } = await supabase
      .from("content_items")
      .update({ order_index: sibling.order_index })
      .eq("id", itemId);
    if (updateAError) throw updateAError;

    const { error: updateBError } = await supabase
      .from("content_items")
      .update({ order_index: current.order_index })
      .eq("id", swapId);
    if (updateBError) throw updateBError;

    revalidatePath(`/admin/dashboard/${pageSlug}`);
    return null;
  });
}
