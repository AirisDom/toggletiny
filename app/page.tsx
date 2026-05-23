import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ToggleTiny</CardTitle>
          <CardDescription>
            Feature flag management for indie developers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="demo-toggle">Demo Feature Flag</Label>
            <Switch id="demo-toggle" />
          </div>
          <div className="flex gap-2">
            <Button>Primary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="secondary">Secondary</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
