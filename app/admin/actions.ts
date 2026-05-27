"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function toggleFlag(id: string): Promise<void> {
  const flag = await prisma.featureFlag.findUnique({
    where: { id },
  });

  if (!flag) {
    throw new Error("Flag not found");
  }

  await prisma.featureFlag.update({
    where: { id },
    data: { isEnabled: !flag.isEnabled },
  });

  revalidatePath("/admin");
}
