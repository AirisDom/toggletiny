"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Environment } from "@/types";

function EnvironmentTabs({ currentEnv }: { currentEnv: Environment }) {
  const environments: Environment[] = ["development", "production"];

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      {environments.map((env) => (
        <Link
          key={env}
          href={`/admin?env=${env}`}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            currentEnv === env
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {env.charAt(0).toUpperCase() + env.slice(1)}
        </Link>
      ))}
    </div>
  );
}

function Logo({ environment }: { environment: Environment }) {
  return (
    <Link href={`/admin?env=${environment}`} className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-primary-foreground"
        >
          <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
          <path d="M2 20h20" />
          <path d="M14 12v.01" />
        </svg>
      </div>
      <span className="text-lg font-semibold tracking-tight">ToggleTiny</span>
    </Link>
  );
}

export function AdminHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const envParam = searchParams.get("env");
  const environment: Environment =
    envParam === "production" ? "production" : "development";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo environment={environment} />
        <div className="flex items-center gap-4">
          <EnvironmentTabs currentEnv={environment} />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
