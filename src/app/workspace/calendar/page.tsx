"use client";

import { CalendarView } from "@/components/workspace/calendar-view";
import { WorkspaceSectionShell } from "@/components/workspace/workspace-section-shell";

export default function CalendarPage() {
  return (
    <WorkspaceSectionShell
      title="Calendar"
      icon={<span className="text-[15px] leading-none">📅</span>}
    >
      <CalendarView />
    </WorkspaceSectionShell>
  );
}
