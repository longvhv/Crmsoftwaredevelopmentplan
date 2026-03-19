import { Sparkles } from "lucide-react";

export function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Test Page</h1>
      <p className="text-muted-foreground">
        If you can see this, the app is working.
      </p>
      
      <div className="mt-8 p-4 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">Status</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>✅ React is loaded</li>
          <li>✅ Router is working</li>
          <li>✅ Tailwind CSS is working</li>
        </ul>
      </div>
    </div>
  );
}