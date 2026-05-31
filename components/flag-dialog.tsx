"use client";

import { useState, useTransition, useRef } from "react";
import { Plus, Pencil } from "lucide-react";
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
import {
  createFlag,
  updateFlag,
  type CreateFlagResult,
  type UpdateFlagResult,
} from "@/app/admin/actions";
import type { Environment, FeatureFlag } from "@/types";

type FormErrors = {
  name?: string;
  key?: string;
  description?: string;
  general?: string;
};

interface FlagDialogProps {
  mode: "create" | "edit";
  flag?: FeatureFlag;
  defaultEnvironment?: Environment;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FlagDialog({
  mode,
  flag,
  defaultEnvironment = "development",
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: FlagDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [environment, setEnvironment] = useState<Environment>(defaultEnvironment);
  const [errors, setErrors] = useState<FormErrors>({});

  const wasOpenRef = useRef(false);

  const initializeForm = () => {
    if (mode === "edit" && flag) {
      setName(flag.name);
      setKey(flag.key);
      setDescription(flag.description);
      setIsEnabled(flag.isEnabled);
      setEnvironment(flag.environment);
    } else {
      setName("");
      setKey("");
      setDescription("");
      setIsEnabled(false);
      setEnvironment(defaultEnvironment);
    }
    setErrors({});
  };

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
    if (mode === "create" && (!key || key === generateKey(name))) {
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
      if (mode === "create") {
        const result: CreateFlagResult = await createFlag({
          name,
          key,
          description,
          isEnabled,
          environment,
        });

        if (result.success) {
          setOpen(false);
          resetForm();
          toast.success("Flag created successfully");
        } else {
          setErrors(result.errors || {});
          if (result.errors?.general) {
            toast.error(result.errors.general);
          }
        }
      } else if (mode === "edit" && flag) {
        const result: UpdateFlagResult = await updateFlag({
          id: flag.id,
          name,
          description,
          isEnabled,
        });

        if (result.success) {
          setOpen(false);
          toast.success("Flag updated successfully");
        } else {
          setErrors(result.errors || {});
          if (result.errors?.general) {
            toast.error(result.errors.general);
          }
        }
      }
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && !wasOpenRef.current) {
      initializeForm();
    }
    wasOpenRef.current = isOpen;
    setOpen(isOpen);
    if (!isOpen) {
      setErrors({});
    }
  };

  const isCreate = mode === "create";
  const title = isCreate ? "Create Feature Flag" : "Edit Feature Flag";
  const description_ = isCreate
    ? "Add a new feature flag to manage functionality in your application."
    : "Update the feature flag details. The key cannot be changed.";
  const submitText = isCreate ? "Create Flag" : "Save Changes";
  const pendingText = isCreate ? "Creating..." : "Saving...";

  const defaultTrigger = isCreate ? (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add Flag
    </Button>
  ) : (
    <Button variant="ghost" size="sm">
      <Pencil className="mr-2 h-4 w-4" />
      Edit
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger !== undefined ? (
        trigger
      ) : (
        <DialogTrigger render={defaultTrigger} />
      )}
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description_}</DialogDescription>
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
                disabled={isPending || mode === "edit"}
                className={mode === "edit" ? "bg-muted cursor-not-allowed" : ""}
              />
              {errors?.key && (
                <p className="text-sm text-destructive">{errors.key}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {mode === "edit"
                  ? "Key cannot be changed after creation"
                  : "Lowercase letters, numbers, and hyphens only"}
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
                disabled={isPending || mode === "edit"}
              >
                <SelectTrigger
                  className={`w-full ${mode === "edit" ? "bg-muted cursor-not-allowed" : ""}`}
                  id="environment"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
              {mode === "edit" && (
                <p className="text-xs text-muted-foreground">
                  Environment cannot be changed after creation
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isEnabled">
                {isCreate ? "Enabled by default" : "Enabled"}
              </Label>
              <Switch
                id="isEnabled"
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
                disabled={isPending}
              />
            </div>

            {errors?.general && (
              <p className="text-sm text-destructive">{errors.general}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" type="button" disabled={isPending} />
              }
            >
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? pendingText : submitText}
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
