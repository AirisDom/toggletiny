"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFlag, type CreateFlagResult } from "@/app/admin/actions";
import type { Environment } from "@/types";

interface AddFlagDialogProps {
  defaultEnvironment?: Environment;
}

export function AddFlagDialog({ defaultEnvironment = "development" }: AddFlagDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [environment, setEnvironment] = useState<Environment>(defaultEnvironment);

  const [errors, setErrors] = useState<CreateFlagResult["errors"]>({});

  const resetForm = () => {
    setName("");
    setKey("");
    setDescription("");
    setIsEnabled(false);
    setEnvironment(defaultEnvironment);
    setErrors({});
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!key || key === generateKey(name)) {
      setKey(generateKey(value));
    }
    if (errors?.name) setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleKeyChange = (value: string) => {
    setKey(value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
    if (errors?.key) setErrors((prev) => ({ ...prev, key: undefined }));
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (errors?.description) setErrors((prev) => ({ ...prev, description: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await createFlag({
        name,
        key,
        description,
        isEnabled,
        environment,
      });

      if (result.success) {
        setOpen(false);
        resetForm();
      } else {
        setErrors(result.errors);
      }
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Add Flag
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Feature Flag</DialogTitle>
            <DialogDescription>
              Add a new feature flag to manage functionality in your application.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="New Checkout Button"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                aria-invalid={!!errors?.name}
                disabled={isPending}
              />
              {errors?.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="key">Key</Label>
              <Input
                id="key"
                placeholder="new-checkout-btn"
                value={key}
                onChange={(e) => handleKeyChange(e.target.value)}
                aria-invalid={!!errors?.key}
                disabled={isPending}
              />
              {errors?.key && (
                <p className="text-sm text-destructive">{errors.key}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Lowercase letters, numbers, and hyphens only
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enables the new checkout button design"
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                aria-invalid={!!errors?.description}
                disabled={isPending}
              />
              {errors?.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="environment">Environment</Label>
              <Select
                value={environment}
                onValueChange={(value) => setEnvironment(value as Environment)}
                disabled={isPending}
              >
                <SelectTrigger className="w-full" id="environment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isEnabled">Enabled by default</Label>
              <Switch
                id="isEnabled"
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" disabled={isPending} />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Flag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function generateKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
