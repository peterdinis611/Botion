"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ItemActionsMenu } from "@/components/workspace/item-actions-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarEventDialog } from "@/components/workspace/calendar-event-dialog";
import {
  CALENDAR_EVENTS_QUERY,
  REMOVE_CALENDAR_EVENT_MUTATION,
} from "@/graphql/operations";
import type { CalendarEvent, CalendarEventsQueryResult } from "@/graphql/types";
import {
  buildMonthGrid,
  eventsForDay,
  formatDayHeading,
  formatEventTime,
  formatMonthYear,
  isSameDay,
  monthRange,
  toDateKey,
} from "@/lib/calendar-utils";
import { staggerItem, transitionFast } from "@/lib/motion";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarView() {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(() => new Date(today));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const { from, to } = monthRange(year, month);

  const { data, loading } = useQuery<CalendarEventsQueryResult>(CALENDAR_EVENTS_QUERY, {
    variables: { from, to },
  });

  const [removeEvent] = useMutation(REMOVE_CALENDAR_EVENT_MUTATION, {
    refetchQueries: [{ query: CALENDAR_EVENTS_QUERY, variables: { from, to } }],
  });

  const events = data?.calendarEvents ?? [];
  const gridDays = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const selectedDayEvents = useMemo(
    () => eventsForDay(events, selectedDate),
    [events, selectedDate],
  );

  function goMonth(delta: number) {
    setViewDate(new Date(year, month + delta, 1));
  }

  function openCreate() {
    setEditingEvent(null);
    setDialogOpen(true);
  }

  function openEdit(event: CalendarEvent) {
    setEditingEvent(event);
    setDialogOpen(true);
  }

  async function handleDelete(event: CalendarEvent) {
    if (!confirm(`Delete "${event.title}"?`)) return;
    await removeEvent({ variables: { id: event.id } });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold tracking-tight">Calendar</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const now = new Date();
              setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
              setSelectedDate(now);
            }}
          >
            Today
          </Button>
          <div className="flex items-center rounded-md border border-border">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => goMonth(-1)}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[10rem] px-2 text-center text-sm font-medium">
              {formatMonthYear(viewDate)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => goMonth(1)}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm" className="gap-1.5" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add event
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="min-h-0 flex-1 overflow-y-auto p-4 lg:p-6">
          {loading && !data ? (
            <Skeleton className="h-[420px] w-full rounded-lg" />
          ) : (
            <div className="rounded-lg border border-border bg-card">
              <div className="grid grid-cols-7 border-b border-border">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {gridDays.map((day) => {
                  const inMonth = day.getMonth() === month;
                  const isToday = isSameDay(day, today);
                  const isSelected = isSameDay(day, selectedDate);
                  const dayEvents = eventsForDay(events, day);
                  const key = toDateKey(day);

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedDate(new Date(day))}
                      onDoubleClick={() => {
                        setSelectedDate(new Date(day));
                        setEditingEvent(null);
                        setDialogOpen(true);
                      }}
                      className={cn(
                        "relative min-h-[88px] border-b border-r border-border p-1.5 text-left transition-colors hover:bg-muted/40",
                        !inMonth && "bg-muted/20 text-muted-foreground",
                        isSelected && "bg-primary/10 ring-1 ring-inset ring-primary/40",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm",
                          isToday && "bg-primary font-semibold text-primary-foreground",
                          isSelected && !isToday && "font-semibold text-primary",
                        )}
                      >
                        {day.getDate()}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {dayEvents.slice(0, 2).map((ev) => (
                          <div
                            key={ev.id}
                            className="truncate rounded px-1 py-0.5 text-[10px] font-medium text-white"
                            style={{ backgroundColor: ev.color }}
                            title={ev.title}
                          >
                            {ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <p className="px-1 text-[10px] text-muted-foreground">
                            +{dayEvents.length - 2} more
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <aside className="flex w-full shrink-0 flex-col border-t border-border bg-muted/20 lg:w-[320px] lg:border-l lg:border-t-0">
          <div className="border-b border-border px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Selected day
            </p>
            <p className="mt-1 text-sm font-medium leading-snug">
              {formatDayHeading(selectedDate)}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3 w-full gap-1.5"
              onClick={() => {
                setEditingEvent(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Add on this day
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading && !data ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={toDateKey(selectedDate)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transitionFast}
                >
                  {selectedDayEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nothing scheduled for this day. Add an event to get started.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {selectedDayEvents.map((event) => (
                        <motion.li
                          key={event.id}
                          variants={staggerItem}
                          initial="hidden"
                          animate="visible"
                          className="rounded-lg border border-border bg-card p-3 shadow-sm"
                        >
                    <div className="flex items-start gap-2">
                      <span
                        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium leading-tight">{event.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatEventTime(event)}
                        </p>
                        {event.location && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </p>
                        )}
                        {event.description && (
                          <p className="mt-2 text-xs text-muted-foreground line-clamp-3">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <ItemActionsMenu label="Akcie udalosti" contentClassName="w-44">
                        <DropdownMenuItem onClick={() => openEdit(event)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Upraviť
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => void handleDelete(event)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Zmazať
                        </DropdownMenuItem>
                      </ItemActionsMenu>
                    </div>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </aside>
      </div>

      <CalendarEventDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingEvent(null);
        }}
        selectedDate={selectedDate}
        event={editingEvent}
        rangeFrom={from}
        rangeTo={to}
      />
    </div>
  );
}
