"use client";

import {
  Bell,
  ChevronDown,
  FileInput,
  LayoutTemplate,
  LogOut,
  Network,
  PanelLeft,
  PanelLeftClose,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImportNoteDialog } from "@/components/workspace/import-note-dialog";
import { SidebarFlatWorkspace } from "@/components/workspace/sidebar-flat-workspace";
import { SidebarWorkspaceTags } from "@/components/workspace/sidebar-workspace-tags";
import { useSnapsPanelOptional } from "@/components/workspace/snaps-panel-context";
import { TemplatesDialog } from "@/components/workspace/templates-dialog";
import type { Folder, Notebook } from "@/graphql/types";
import { useSidebar } from "@/hooks/use-sidebar";
import { useWorkspaceCreate } from "@/hooks/use-workspace-create";
import { cn } from "@/lib/utils";
import { buildWorkspaceHref, parseWorkspaceFilters } from "@/lib/workspace-url";

export function AppSidebar({
  folders,
  notebooks,
}: {
  folders: Folder[];
  notebooks: Notebook[];
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = parseWorkspaceFilters(searchParams);
  const { collapsed, toggleCollapsed } = useSidebar();
  const { openFolderDialog, openNotebookDialog, createNewPage } = useWorkspaceCreate();
  const snapsPanel = useSnapsPanelOptional();
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const isSettings = pathname === "/workspace/settings";
  const isCalendar = pathname === "/workspace/calendar";
  const isGraphs = pathname.startsWith("/workspace/graphs");

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-full shrink-0 flex-col border-r border-border/50 bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out",
          collapsed ? "w-[52px]" : "w-[220px]",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-3.5",
            collapsed && "flex-col px-2",
          )}
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-border/80 bg-black text-[13px] font-bold text-white"
            aria-hidden
          >
            B
          </div>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">
                Botion
              </span>
              <button
                type="button"
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label="Switch workspace"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7 shrink-0 text-muted-foreground opacity-0 hover:opacity-100 group-hover/sidebar:opacity-100",
              collapsed ? "mt-1 opacity-100" : "ml-auto",
            )}
            onClick={toggleCollapsed}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          {!collapsed && (
            <nav className="pb-3">
              <div className="mb-1 flex items-center justify-between px-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Workspace
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-muted-foreground hover:text-foreground"
                  onClick={() => openNotebookDialog()}
                  title="New workspace"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>

              <SidebarFlatWorkspace
                notebooks={notebooks}
                onCreateWorkspace={() => openNotebookDialog()}
                onNewPage={(notebookId) => void createNewPage(notebookId)}
              />

              <SidebarWorkspaceTags
                notebookId={filters.notebookId}
                collapsed={collapsed}
              />

              <div className="mt-5">
                <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Quick actions
                </p>
                <SidebarNavItem
                  href="/workspace"
                  active={false}
                  icon={<LayoutTemplate className="h-4 w-4 stroke-[1.5]" />}
                  label="Templates"
                  onClick={(e) => {
                    e.preventDefault();
                    setTemplatesOpen(true);
                  }}
                />
                <SidebarNavItem
                  href="/workspace"
                  active={false}
                  icon={<FileInput className="h-4 w-4 stroke-[1.5]" />}
                  label="Import"
                  onClick={(e) => {
                    e.preventDefault();
                    setImportOpen(true);
                  }}
                />
                <SidebarNavItem
                  href="/workspace/calendar"
                  active={isCalendar}
                  icon={<Bell className="h-4 w-4 stroke-[1.5]" />}
                  label="Updates"
                />
                <SidebarNavItem
                  href="/workspace/graphs"
                  active={isGraphs}
                  icon={<Network className="h-4 w-4 stroke-[1.5]" />}
                  label="Graphs"
                />
                <SidebarNavItem
                  href="/workspace?archived=1"
                  active={!!filters.archived && !isSettings}
                  icon={<Trash2 className="h-4 w-4 stroke-[1.5]" />}
                  label="Trash"
                  onClick={() =>
                    router.push(
                      buildWorkspaceHref(searchParams, {
                        archived: true,
                        pinned: false,
                        clearTag: true,
                        clearNotebook: true,
                        clearFolder: true,
                      }),
                    )
                  }
                />
              </div>
            </nav>
          )}
        </ScrollArea>

        <div className="p-2">
          {!collapsed ? (
            <>
              <Button
                variant="ghost"
                className="mb-1 h-9 w-full justify-start gap-2 px-2.5 text-[13px] font-normal text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                onClick={() => snapsPanel?.openAddSnap()}
              >
                <Plus className="h-4 w-4" />
                Add snap
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                      {user?.name?.[0]?.toUpperCase() ?? "?"}
                    </span>
                    <span className="truncate">{user?.name ?? "Account"}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/workspace/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openFolderDialog()}>
                    New folder
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add snap</TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>

      <TemplatesDialog open={templatesOpen} onOpenChange={setTemplatesOpen} />
      <ImportNoteDialog open={importOpen} onOpenChange={setImportOpen} />
    </TooltipProvider>
  );
}

function SidebarNavItem({
  href,
  active,
  icon,
  label,
  onClick,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
        active
          ? "bg-sidebar-accent font-medium text-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/80 hover:text-foreground",
      )}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">{icon}</span>
      {label}
    </Link>
  );
}
