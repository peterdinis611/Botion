import { FileQuestion } from "lucide-react";
import { StatusPage, StatusPageLink } from "@/components/layout/status-page";

export default function NotFound() {
  return (
    <StatusPage
      code={404}
      icon={FileQuestion}
      title="Page not found"
      description="This page doesn't exist or may have been moved."
      hint="Double-check the URL, or head back to your workspace."
    >
      <StatusPageLink href="/workspace">Open workspace</StatusPageLink>
      <StatusPageLink href="/login" variant="secondary">
        Sign in
      </StatusPageLink>
    </StatusPage>
  );
}
