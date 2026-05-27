import { prisma } from "@/lib/prisma";
import { FlagsTable } from "@/components/flags-table";
import { AddFlagDialog } from "@/components/add-flag-dialog";
import type { Environment, FeatureFlag } from "@/types";

interface AdminPageProps {
  searchParams: Promise<{ env?: string }>;
}

async function getFlags(environment: Environment): Promise<FeatureFlag[]> {
  const flags = await prisma.featureFlag.findMany({
    where: { environment },
    orderBy: { createdAt: "desc" },
  });

  return flags.map((flag) => ({
    ...flag,
    environment: flag.environment as Environment,
  }));
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const environment: Environment =
    params.env === "production" ? "production" : "development";
  const flags = await getFlags(environment);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feature Flags</h1>
          <p className="text-muted-foreground">
            Manage your feature flags across environments.
          </p>
        </div>
        <AddFlagDialog defaultEnvironment={environment} />
      </div>
      <FlagsTable flags={flags} />
    </div>
  );
}
