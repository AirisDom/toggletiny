import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="rounded-lg border bg-muted/50 overflow-hidden">
      {title && (
        <div className="border-b bg-muted px-4 py-2 text-xs font-medium text-muted-foreground">
          {title}
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-sm">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              T
            </div>
            <span className="font-semibold">ToggleTiny</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-2 mb-12">
          <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Integrate ToggleTiny feature flags into your application.
          </p>
        </div>

        <div className="grid gap-8">
          <Section title="Authentication">
            <Card>
              <CardHeader>
                <CardTitle>API Key Authentication</CardTitle>
                <CardDescription>
                  All API requests require authentication via an API key.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Include your API key in request headers using one of these methods:
                </p>
                <div className="space-y-3">
                  <div>
                    <Badge variant="outline" className="mb-2">Authorization Header</Badge>
                    <CodeBlock>Authorization: Bearer your-api-key</CodeBlock>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">X-API-Key Header</Badge>
                    <CodeBlock>x-api-key: your-api-key</CodeBlock>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section title="Endpoints">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge>GET</Badge>
                  <code className="text-lg font-mono">/api/flags</code>
                </div>
                <CardDescription>
                  Fetch all feature flags for a specific environment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Query Parameters</h4>
                  <div className="rounded-lg border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-3 font-medium">Parameter</th>
                          <th className="text-left p-3 font-medium">Type</th>
                          <th className="text-left p-3 font-medium">Default</th>
                          <th className="text-left p-3 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-3 font-mono text-xs">env</td>
                          <td className="p-3"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">string</code></td>
                          <td className="p-3"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">production</code></td>
                          <td className="p-3 text-muted-foreground">Environment to fetch flags for. Either <code className="text-xs bg-muted px-1.5 py-0.5 rounded">development</code> or <code className="text-xs bg-muted px-1.5 py-0.5 rounded">production</code></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Response Headers</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Responses include caching and validation headers for optimal performance:
                  </p>
                  <div className="space-y-3">
                    <CodeBlock>Cache-Control: public, max-age=10, s-maxage=60, stale-while-revalidate=300</CodeBlock>
                    <CodeBlock>ETag: "abc123..."</CodeBlock>
                    <CodeBlock>Vary: Accept-Encoding</CodeBlock>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section title="TypeScript Types">
            <Card>
              <CardHeader>
                <CardTitle>Response Types</CardTitle>
                <CardDescription>
                  TypeScript interfaces for type-safe integration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock title="types.ts">{`// Environment type
type Environment = 'development' | 'production';

// API Response type - key-value pairs of flag keys and their states
type FlagResponse = Record<string, boolean>;

// Example response shape
// {
//   "new-checkout-btn": true,
//   "beta-dashboard": false,
//   "dark-mode": true
// }

// Full FeatureFlag interface (for reference)
interface FeatureFlag {
  id: string;          // UUID
  name: string;        // Human readable name
  key: string;         // Code reference key
  description: string;
  isEnabled: boolean;
  environment: Environment;
  createdAt: Date;
  updatedAt: Date;
}`}</CodeBlock>
              </CardContent>
            </Card>
          </Section>

          <Section title="Example Usage">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>cURL</CardTitle>
                  <CardDescription>
                    Fetch production flags from the command line.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CodeBlock title="Fetch production flags">{`curl -X GET "https://your-domain.com/api/flags" \\
  -H "Authorization: Bearer your-api-key"`}</CodeBlock>
                  <CodeBlock title="Fetch development flags">{`curl -X GET "https://your-domain.com/api/flags?env=development" \\
  -H "x-api-key: your-api-key"`}</CodeBlock>
                  <CodeBlock title="Example response">{`{
  "new-checkout-btn": true,
  "beta-dashboard": false,
  "dark-mode": true
}`}</CodeBlock>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>JavaScript / TypeScript</CardTitle>
                  <CardDescription>
                    Fetch and use feature flags in your application.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CodeBlock title="fetch-flags.ts">{`type FlagResponse = Record<string, boolean>;

async function fetchFlags(env: 'development' | 'production' = 'production'): Promise<FlagResponse> {
  const response = await fetch(\`https://your-domain.com/api/flags?env=\${env}\`, {
    headers: {
      'Authorization': 'Bearer your-api-key',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch feature flags');
  }

  return response.json();
}

// Usage
const flags = await fetchFlags();

if (flags['new-checkout-btn']) {
  // Show new checkout button
}

if (flags['beta-dashboard']) {
  // Enable beta dashboard features
}`}</CodeBlock>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>React Hook</CardTitle>
                  <CardDescription>
                    A custom hook for fetching flags in React applications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock title="use-feature-flags.ts">{`import { useState, useEffect } from 'react';

type FlagResponse = Record<string, boolean>;

export function useFeatureFlags(env: 'development' | 'production' = 'production') {
  const [flags, setFlags] = useState<FlagResponse>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFlags() {
      try {
        const response = await fetch(\`https://your-domain.com/api/flags?env=\${env}\`, {
          headers: {
            'Authorization': \`Bearer \${process.env.NEXT_PUBLIC_TOGGLETINY_API_KEY}\`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch flags');

        const data = await response.json();
        setFlags(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    loadFlags();
  }, [env]);

  return { flags, loading, error };
}

// Usage in a component
function MyComponent() {
  const { flags, loading } = useFeatureFlags();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {flags['new-feature'] && <NewFeature />}
    </div>
  );
}`}</CodeBlock>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section title="Caching & Performance">
            <Card>
              <CardHeader>
                <CardTitle>Response Caching</CardTitle>
                <CardDescription>
                  The API is optimized for high performance with CDN caching and conditional requests.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Cache-Control Directives</h4>
                  <div className="rounded-lg border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-3 font-medium">Directive</th>
                          <th className="text-left p-3 font-medium">Value</th>
                          <th className="text-left p-3 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">public</td>
                          <td className="p-3">-</td>
                          <td className="p-3 text-muted-foreground">Response can be cached by browsers and CDNs</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">max-age</td>
                          <td className="p-3">10 seconds</td>
                          <td className="p-3 text-muted-foreground">Browser cache freshness duration</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-mono text-xs">s-maxage</td>
                          <td className="p-3">60 seconds</td>
                          <td className="p-3 text-muted-foreground">CDN/shared cache freshness duration</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono text-xs">stale-while-revalidate</td>
                          <td className="p-3">300 seconds</td>
                          <td className="p-3 text-muted-foreground">Serve stale content while fetching fresh data in background</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Conditional Requests with ETag</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    The API supports conditional requests using ETags. Send the <code className="text-xs bg-muted px-1.5 py-0.5 rounded">If-None-Match</code> header
                    with the ETag value from a previous response. If the data hasn&apos;t changed, you&apos;ll receive a <code className="text-xs bg-muted px-1.5 py-0.5 rounded">304 Not Modified</code> response
                    with no body, saving bandwidth.
                  </p>
                  <CodeBlock title="Conditional request example">{`# First request - get ETag from response headers
curl -I "https://your-domain.com/api/flags" \\
  -H "Authorization: Bearer your-api-key"
# Response includes: ETag: "a1b2c3d4..."

# Subsequent request - use ETag for conditional fetch
curl -X GET "https://your-domain.com/api/flags" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "If-None-Match: \\"a1b2c3d4...\\""
# Returns 304 Not Modified if unchanged, 200 with new data otherwise`}</CodeBlock>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recommended Client Caching Strategy</h4>
                  <p className="text-sm text-muted-foreground">
                    For optimal performance, consider implementing a local cache in your application that respects the
                    Cache-Control headers. Poll the API periodically (e.g., every 30-60 seconds) using conditional requests
                    to minimize bandwidth while keeping flags up-to-date. The <code className="text-xs bg-muted px-1.5 py-0.5 rounded">stale-while-revalidate</code> directive
                    ensures fast responses even when the cache needs refreshing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section title="Error Responses">
            <Card>
              <CardHeader>
                <CardTitle>HTTP Status Codes</CardTitle>
                <CardDescription>
                  Possible error responses from the API.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Description</th>
                        <th className="text-left p-3 font-medium">Response Body</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">
                          <Badge variant="default">200</Badge>
                        </td>
                        <td className="p-3">Success</td>
                        <td className="p-3 font-mono text-xs">{`{ "flag-key": true, ... }`}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">
                          <Badge variant="secondary">304</Badge>
                        </td>
                        <td className="p-3">Not Modified (ETag matched)</td>
                        <td className="p-3 font-mono text-xs text-muted-foreground">No body</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">
                          <Badge variant="destructive">400</Badge>
                        </td>
                        <td className="p-3">Invalid environment parameter</td>
                        <td className="p-3 font-mono text-xs">{`{ "error": "Invalid environment: xyz..." }`}</td>
                      </tr>
                      <tr>
                        <td className="p-3">
                          <Badge variant="destructive">401</Badge>
                        </td>
                        <td className="p-3">Missing or invalid API key</td>
                        <td className="p-3 font-mono text-xs">{`{ "error": "Unauthorized..." }`}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </Section>
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground text-center">
            ToggleTiny — Feature flag management for indie developers
          </p>
        </div>
      </footer>
    </div>
  );
}
