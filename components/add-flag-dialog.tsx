"use client";

import { FlagDialog } from "@/components/flag-dialog";
import type { Environment } from "@/types";

interface AddFlagDialogProps {
  defaultEnvironment?: Environment;
}

export function AddFlagDialog({ defaultEnvironment = "development" }: AddFlagDialogProps) {
  return <FlagDialog mode="create" defaultEnvironment={defaultEnvironment} />;
}
