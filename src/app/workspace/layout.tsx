import { Suspense } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { WorkspaceLoading } from "@/components/layout/workspace-loading";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { WorkspaceCreateProvider } from "@/hooks/use-workspace-create";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <WorkspaceCreateProvider>
          <Suspense fallback={<WorkspaceLoading />}>{children}</Suspense>
        </WorkspaceCreateProvider>
      </SidebarProvider>
    </AuthGuard>
  );
}
