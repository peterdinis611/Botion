"use client";

import { CalendarView } from "@/components/workspace/calendar-view";
import { WorkspaceFrame } from "@/components/workspace/workspace-frame";

export default function CalendarPage() {
  return (
    <WorkspaceFrame>
      <CalendarView />
    </WorkspaceFrame>
  );
}
