"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Environment } from "@/types";

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

export type CreateFlagInput = {
  name: string;
  key: string;
  description: string;
  isEnabled: boolean;
  environment: Environment;
};

export type CreateFlagResult = {
  success: boolean;
  errors?: {
    name?: string;
    key?: string;
    description?: string;
    general?: string;
  };
};

const KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function createFlag(input: CreateFlagInput): Promise<CreateFlagResult> {
  const errors: CreateFlagResult["errors"] = {};

  if (!input.name.trim()) {
    errors.name = "Name is required";
  }

  if (!input.key.trim()) {
    errors.key = "Key is required";
  } else if (!KEY_PATTERN.test(input.key)) {
    errors.key = "Key must be lowercase alphanumeric with hyphens only";
  }

  if (!input.description.trim()) {
    errors.description = "Description is required";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const existing = await prisma.featureFlag.findUnique({
    where: {
      key_environment: {
        key: input.key,
        environment: input.environment,
      },
    },
  });

  if (existing) {
    return {
      success: false,
      errors: { key: `A flag with this key already exists in ${input.environment}` },
    };
  }

  await prisma.featureFlag.create({
    data: {
      name: input.name.trim(),
      key: input.key.trim(),
      description: input.description.trim(),
      isEnabled: input.isEnabled,
      environment: input.environment,
    },
  });

  revalidatePath("/admin");
  return { success: true };
}

export type UpdateFlagInput = {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
};

export type UpdateFlagResult = {
  success: boolean;
  errors?: {
    name?: string;
    description?: string;
    general?: string;
  };
};

export async function updateFlag(input: UpdateFlagInput): Promise<UpdateFlagResult> {
  const errors: UpdateFlagResult["errors"] = {};

  if (!input.name.trim()) {
    errors.name = "Name is required";
  }

  if (!input.description.trim()) {
    errors.description = "Description is required";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const existing = await prisma.featureFlag.findUnique({
    where: { id: input.id },
  });

  if (!existing) {
    return {
      success: false,
      errors: { general: "Flag not found" },
    };
  }

  await prisma.featureFlag.update({
    where: { id: input.id },
    data: {
      name: input.name.trim(),
      description: input.description.trim(),
      isEnabled: input.isEnabled,
    },
  });

  revalidatePath("/admin");
  return { success: true };
}

export type DeleteFlagResult = {
  success: boolean;
  error?: string;
};

export async function deleteFlag(id: string): Promise<DeleteFlagResult> {
  const existing = await prisma.featureFlag.findUnique({
    where: { id },
  });

  if (!existing) {
    return { success: false, error: "Flag not found" };
  }

  await prisma.featureFlag.delete({
    where: { id },
  });

  revalidatePath("/admin");
  return { success: true };
}
