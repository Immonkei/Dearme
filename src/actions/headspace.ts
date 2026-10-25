"use server";

import { revalidatePath } from "next/cache";
import { getAuthorizedOwner } from "@/lib/supabase/server";
import { saveHeadspace } from "@/lib/journal/repository";
import { HeadspaceData } from "@/types/journal";

export async function updateHeadspaceAction(formData: FormData): Promise<{
  error?: string;
  success?: boolean;
}> {
  const owner = await getAuthorizedOwner();
  if (!owner) {
    return { error: "Unauthorized: only the owner can update Current Headspace." };
  }

  const stateOfMind = formData.get("stateOfMind") as string;
  const dailyRitual = formData.get("dailyRitual") as string;
  const lettingGoOf = formData.get("lettingGoOf") as string;
  const holdingOnto = formData.get("holdingOnto") as string;

  const data: HeadspaceData = {
    stateOfMind: stateOfMind || "",
    dailyRitual: dailyRitual || "",
    lettingGoOf: lettingGoOf || "",
    holdingOnto: holdingOnto || "",
  };

  const res = await saveHeadspace(data);
  if (res.error) {
    return { error: res.error };
  }

  revalidatePath("/");
  revalidatePath("/journal");
  revalidatePath("/journal/headspace");

  return { success: true };
}
