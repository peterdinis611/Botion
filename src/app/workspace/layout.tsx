import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { WorkspaceLoading } from "@/components/layout/workspace-loading";
import { WorkspaceNotificationSubscriber } from "@/components/workspace/workspace-notification-subscriber";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { WorkspaceCreateProvider } from "@/hooks/use-workspace-create";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Workspace",
  description: "Your private Botion workspace.",
  path: "/workspace",
  noIndex: true,
});

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<WorkspaceLoading />}>
      <AuthGuard>
        <WorkspaceNotificationSubscriber />
        <SidebarProvider>
          <WorkspaceCreateProvider>
            <Suspense fallback={<WorkspaceLoading />}>{children}</Suspense>
          </WorkspaceCreateProvider>
        </SidebarProvider>
      </AuthGuard>
    </Suspense>
  );
}
