"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pin,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDailyBriefing } from "@/hooks/use-daily-briefing";
import { formatEventTime, parseDateKey, toDateKey } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";
import { pageDisplayTitle } from "@/lib/workspace-pages";

function shiftDateKey(dateKey: string, days: number): string {
  const d = parseDateKey(dateKey);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

function formatBriefDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  const todayKey = toDateKey(new Date());
  const label = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  if (dateKey === todayKey) return `Today · ${label}`;
  const tomorrowKey = shiftDateKey(todayKey, 1);
  const yesterdayKey = shiftDateKey(todayKey, -1);
  if (dateKey === tomorrowKey) return `Tomorrow · ${label}`;
  if (dateKey === yesterdayKey) return `Yesterday · ${label}`;
  return label;
}

export function DailyBriefSection() {
  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const [dateKey, setDateKey] = useState(todayKey);
  const { briefing, loading } = useDailyBriefing(dateKey);

  const events = briefing?.calendarEvents ?? [];
  const notes = briefing?.importantNotes ?? [];
  const isToday = dateKey === todayKey;

  return (
    <section className="mb-10 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-background to-background p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Your day
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                Live
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{formatBriefDate(dateKey)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setDateKey((d) => shiftDateKey(d, -1))}
            aria-label="Previous day"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs"
            disabled={dateKey === todayKey}
            onClick={() => setDateKey(todayKey)}
          >
            Today
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setDateKey((d) => shiftDateKey(d, 1))}
            aria-label="Next day"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-card/80 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              Calendar
            </div>
            <Link
              href="/workspace/calendar"
              className="text-xs font-medium text-primary hover:underline"
            >
              Open calendar
            </Link>
          </div>

          {loading && !briefing ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ) : events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events scheduled for this day.</p>
          ) : (
            <ul className="space-y-2">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="rounded-lg border border-border/40 bg-background px-3 py-2.5"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatEventTime(event)}
                      </p>
                      {event.location && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border/50 bg-card/80 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <Pin className="h-4 w-4 text-primary" />
            Important notes
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Pinned pages and notes updated on this day.
          </p>

          {loading && !briefing ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ) : notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No pinned or recently updated notes for this day.
            </p>
          ) : (
            <ul className="space-y-2">
              {notes.map((note) => (
                <li key={note.id}>
                  <Link
                    href={`/workspace/notes/${note.id}`}
                    className={cn(
                      "flex items-start gap-2.5 rounded-lg border border-border/40 bg-background px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-primary/5",
                    )}
                  >
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs"
                      style={{ backgroundColor: `${note.color}22` }}
                    >
                      {note.isPinned ? "📌" : "📄"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {pageDisplayTitle(note)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {note.isPinned
                          ? "Pinned"
                          : isToday
                            ? "Updated today"
                            : "Updated this day"}
                        {" · "}
                        {new Date(note.updatedAt).toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
