"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { deleteFlag } from "@/app/admin/actions";
import type { FeatureFlag } from "@/types";

interface DeleteFlagDialogProps {
  flag: FeatureFlag;
}

export function DeleteFlagDialog({ flag }: DeleteFlagDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteFlag(flag.id);
      if (result.success) {
        setOpen(false);
        toast.success(`Flag "${flag.name}" deleted`);
      } else {
        const errorMsg = result.error || "Failed to delete flag";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Feature Flag</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the flag{" "}
            <span className="font-semibold text-foreground">&quot;{flag.name}&quot;</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" type="button" disabled={isPending} />
            }
          >
            Cancel
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Flag"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
