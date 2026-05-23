"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Archive,
  BookOpen,
  CalendarDays,
  Home,
  Network,
  LogOut,
  PanelLeft,
  PanelLeftClose,
  Plus,
  Settings,
  Star,
} from "lucide-react";
import { buildWorkspaceHref, parseWorkspaceFilters } from "@/lib/workspace-url";
import { SidebarWorkspaceTree } from "@/components/workspace/sidebar-workspace-tree";
import { SidebarQuickFind } from "@/components/workspace/sidebar-quick-find";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { useSidebar } from "@/hooks/use-sidebar";
import { useWorkspaceCreate } from "@/hooks/use-workspace-create";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Folder, Notebook, Tag as TagType } from "@/graphql/types";

export function AppSidebar({
  folders,
  notebooks,
  tags,
}: {
  folders: Folder[];
  notebooks: Notebook[];
  tags: TagType[];
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = parseWorkspaceFilters(searchParams);
  const { collapsed, toggleCollapsed } = useSidebar();
  const { openFolderDialog, openNotebookDialog, createNewPage } =
    useWorkspaceCreate();

  const activeNotebookId = filters.notebookId;
  const activeFolderId = filters.folderId;
  const activeTagId = filters.tagId;
  const isSettings = pathname === "/workspace/settings";
  const isCalendar = pathname === "/workspace/calendar";
  const isGraphs = pathname.startsWith("/workspace/graphs");

  const isAllNotesActive =
    !isSettings &&
    !isCalendar &&
    !isGraphs &&
    !activeNotebookId &&
    !activeFolderId &&
    !filters.pinned &&
    !filters.archived &&
    !activeTagId;

  const initials =
    user?.name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-full shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out",
          collapsed ? "w-[52px]" : "w-[260px]",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 py-3",
            collapsed ? "flex-col px-1.5" : "px-3",
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <BookOpen className="h-4 w-4" />
          </div>
          {!collapsed && (
            <span className="min-w-0 flex-1 truncate text-[15px] font-semibold tracking-tight">
              Botion
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground"
            onClick={toggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className={cn("px-2 pb-2", collapsed && "flex justify-center")}>
          <SidebarQuickFind collapsed={collapsed} />
        </div>

        <ScrollArea className="flex-1 px-1.5">
          <nav className="space-y-0.5 pb-2">
            <SidebarNavItem
              href="/workspace"
              active={isAllNotesActive}
              collapsed={collapsed}
              icon={<Home className="h-4 w-4" />}
              label="All notes"
              onClick={() => router.push("/workspace")}
            />
            <SidebarNavItem
              href="/workspace?pinned=1"
              active={
                !!filters.pinned &&
                !filters.archived &&
                !isSettings &&
                !isCalendar &&
                !isGraphs
              }
              collapsed={collapsed}
              icon={<Star className="h-4 w-4" />}
              label="Pinned"
              onClick={() =>
                router.push(
                  buildWorkspaceHref(searchParams, {
                    pinned: true,
                    archived: false,
                    clearTag: true,
                  }),
                )
              }
            />
            <SidebarNavItem
              href="/workspace/calendar"
              active={isCalendar}
              collapsed={collapsed}
              icon={<CalendarDays className="h-4 w-4" />}
              label="Calendar"
            />
            <SidebarNavItem
              href="/workspace/graphs"
              active={isGraphs}
              collapsed={collapsed}
              icon={<Network className="h-4 w-4" />}
              label="Graphs"
            />
            <SidebarNavItem
              href="/workspace?archived=1"
              active={
                !!filters.archived && !isSettings && !isCalendar && !isGraphs
              }
              collapsed={collapsed}
              icon={<Archive className="h-4 w-4" />}
              label="Archive"
              onClick={() =>
                router.push(
                  buildWorkspaceHref(searchParams, {
                    archived: true,
                    pinned: false,
                    clearTag: true,
                  }),
                )
              }
            />

            {tags.length > 0 && !collapsed && (
              <div className="pt-1">
                <p className="px-2.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Tags
                </p>
                {tags.map((tag) => (
                  <SidebarNavItem
                    key={tag.id}
                    href={`/workspace?tag=${tag.id}`}
                    active={activeTagId === tag.id}
                    collapsed={collapsed}
                    icon={
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                    }
                    label={tag.name}
                    onClick={() =>
                      router.push(
                        buildWorkspaceHref(searchParams, {
                          tagId: tag.id,
                          archived: false,
                        }),
                      )
                    }
                  />
                ))}
              </div>
            )}

            {!collapsed && (
              <>
                <Separator className="my-2.5" />

                <div className="flex items-center justify-between px-2 pb-1 pt-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Workspace
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={openFolderDialog}
                    title="New folder"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <SidebarWorkspaceTree
                  folders={folders}
                  notebooks={notebooks}
                  onNewNotebookInFolder={(folderId) =>
                    openNotebookDialog(folderId)
                  }
                  onNewPage={createNewPage}
                  onNewLooseNotebook={() => openNotebookDialog()}
                />
              </>
            )}
          </nav>
        </ScrollArea>

        <div className="border-t border-border p-2">
          <SidebarNavItem
            href="/workspace/settings"
            active={isSettings}
            collapsed={collapsed}
            icon={<Settings className="h-4 w-4" />}
            label="Settings"
          />

          <div
            className={cn(
              "mt-1 flex items-center gap-2 rounded-md px-1 py-1",
              collapsed && "justify-center",
            )}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary/15 text-xs font-medium text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-tight">
                    {user?.name}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground"
                  onClick={logout}
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          {collapsed && (
            <div className="flex justify-center pt-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign out</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

function SidebarNavItem({
  href,
  active,
  collapsed,
  icon,
  label,
  onClick,
}: {
  href: string;
  active: boolean;
  collapsed: boolean;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  const link = (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center rounded-md text-sm transition-colors",
        collapsed
          ? "justify-center px-2 py-2.5"
          : "gap-2.5 px-2.5 py-2",
        active
          ? "bg-sidebar-accent font-medium text-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
      )}
    >
      <span className={cn(!active && "opacity-80")}>{icon}</span>
      {!collapsed && label}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
