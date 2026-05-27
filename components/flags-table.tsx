"use client";

import { useTransition } from "react";
import { FeatureFlag } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toggleFlag } from "@/app/admin/actions";

interface FlagsTableProps {
  flags: FeatureFlag[];
}

function FlagToggle({ flag }: { flag: FeatureFlag }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleFlag(flag.id);
    });
  };

  return (
    <Switch
      checked={flag.isEnabled}
      onCheckedChange={handleToggle}
      disabled={isPending}
      aria-label={`Toggle ${flag.name}`}
    />
  );
}

export function FlagsTable({ flags }: FlagsTableProps) {
  if (flags.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        No feature flags found for this environment.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Toggle</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flags.map((flag) => (
            <TableRow key={flag.id}>
              <TableCell className="font-medium">{flag.name}</TableCell>
              <TableCell>
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
                  {flag.key}
                </code>
              </TableCell>
              <TableCell className="hidden max-w-xs truncate md:table-cell">
                {flag.description}
              </TableCell>
              <TableCell>
                <Badge variant={flag.isEnabled ? "default" : "secondary"}>
                  {flag.isEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </TableCell>
              <TableCell>
                <FlagToggle flag={flag} />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
