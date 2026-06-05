"use client";

import {
  LogOut,
  PanelLeft,
  PanelLeftClose,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import {
  SidebarWorkspaceSearch,
  filterNotesForSidebar,
} from "@/components/workspace/sidebar-workspace-search";
import { SidebarWorkspaceSwitcher } from "@/components/workspace/sidebar-workspace-switcher";
import { SidebarWorkspaceTags } from "@/components/workspace/sidebar-workspace-tags";
import type { Note, Notebook } from "@/graphql/types";
import { useSidebar } from "@/hooks/use-sidebar";
import { useWorkspaceCreate } from "@/hooks/use-workspace-create";
import { ui } from "@/lib/ui-surface";
import { cn } from "@/lib/utils";
import { parseWorkspaceFilters } from "@/lib/workspace-url";

export function AppSidebar({
  notebooks,
  notes = [],
}: {
  notebooks: Notebook[];
  notes?: Note[];
}) {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const filters = parseWorkspaceFilters(searchParams);
  const { collapsed, toggleCollapsed } = useSidebar();
  const { openFolderDialog, openNotebookDialog, openNewPageDialog } =
    useWorkspaceCreate();
  const [importOpen, setImportOpen] = useState(false);
  const [sidebarQuery, setSidebarQuery] = useState("");

  const filteredNotes = filterNotesForSidebar(notes, sidebarQuery);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          ui.sidebar,
          "group/sidebar",
          collapsed ? ui.sidebarCollapsed : ui.sidebarExpanded,
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 border-b border-sidebar-border px-3 py-3",
            collapsed && "flex-col px-2",
          )}
        >
          <span className={ui.brandMark} aria-hidden>
            B
          </span>
          {!collapsed && (
            <SidebarWorkspaceSwitcher
              notebooks={notebooks}
              notes={notes}
              onCreateWorkspace={() => openNotebookDialog()}
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7 shrink-0 text-muted-foreground",
              collapsed ? "mt-1" : "ml-auto",
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

        <ScrollArea className="flex-1 px-2 py-2">
          {!collapsed && (
            <nav className="space-y-4 pb-3">
              <div>
                <div className="mb-2 flex items-center justify-between px-2">
                  <span className={ui.sectionLabel}>Pages</span>
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

                <SidebarWorkspaceSearch
                  notebooks={notebooks}
                  notes={notes}
                  query={sidebarQuery}
                  onQueryChange={setSidebarQuery}
                />

                <SidebarFlatWorkspace
                  notebooks={notebooks}
                  notes={filteredNotes}
                  onCreateWorkspace={() => openNotebookDialog()}
                  onNewPage={(notebookId) => openNewPageDialog(notebookId)}
                />
              </div>

              <SidebarWorkspaceTags
                notebookId={filters.notebookId}
                collapsed={collapsed}
              />
            </nav>
          )}
        </ScrollArea>

        <div className="border-t border-sidebar-border p-2">
          {!collapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
                    {user?.name?.[0]?.toUpperCase() ?? "?"}
                  </span>
                  <span className="truncate font-medium">{user?.name ?? "Account"}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-52">
                <DropdownMenuItem asChild>
                  <Link href="/workspace/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openFolderDialog()}>
                  New folder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setImportOpen(true)}>
                  Import page
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => openNewPageDialog(filters.notebookId)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">New page</TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>

      <ImportNoteDialog open={importOpen} onOpenChange={setImportOpen} />
    </TooltipProvider>
  );
}
