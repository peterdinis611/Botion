"use client";

import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CALENDAR_EVENTS_QUERY,
  CREATE_CALENDAR_EVENT_MUTATION,
  UPDATE_CALENDAR_EVENT_MUTATION,
} from "@/graphql/operations";
import type {
  CalendarEvent,
  CreateCalendarEventResult,
  UpdateCalendarEventResult,
} from "@/graphql/types";
import {
  dayEndISO,
  dayStartISO,
  fromDateTimeLocal,
  toDateInputValue,
  toDateTimeLocalValue,
} from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

const COLOR_OPTIONS = [
  "#0d9488",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#ef4444",
  "#64748b",
];

export function CalendarEventDialog({
  open,
  onOpenChange,
  selectedDate,
  event,
  rangeFrom,
  rangeTo,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  event?: CalendarEvent | null;
  rangeFrom: string;
  rangeTo: string;
}) {
  const isEdit = Boolean(event);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [allDay, setAllDay] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  const refetch = {
    query: CALENDAR_EVENTS_QUERY,
    variables: { from: rangeFrom, to: rangeTo },
  };

  const [createEvent, { loading: creating }] = useMutation<CreateCalendarEventResult>(
    CREATE_CALENDAR_EVENT_MUTATION,
    {
      refetchQueries: [refetch],
    },
  );

  const [updateEvent, { loading: updating }] = useMutation<UpdateCalendarEventResult>(
    UPDATE_CALENDAR_EVENT_MUTATION,
    {
      refetchQueries: [refetch],
    },
  );

  useEffect(() => {
    if (!open) return;

    if (event) {
      setTitle(event.title);
      setDescription(event.description ?? "");
      setLocation(event.location ?? "");
      setAllDay(event.allDay);
      setColor(event.color);
      const start = new Date(event.startAt);
      const end = new Date(event.endAt);
      setStartDate(toDateInputValue(start));
      setEndDate(toDateInputValue(end));
      setStartDateTime(toDateTimeLocalValue(start));
      setEndDateTime(toDateTimeLocalValue(end));
      return;
    }

    const day = toDateInputValue(selectedDate);
    const start = new Date(selectedDate);
    start.setHours(9, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(10, 0, 0, 0);

    setTitle("");
    setDescription("");
    setLocation("");
    setAllDay(true);
    setColor(COLOR_OPTIONS[0]);
    setStartDate(day);
    setEndDate(day);
    setStartDateTime(toDateTimeLocalValue(start));
    setEndDateTime(toDateTimeLocalValue(end));
  }, [open, event, selectedDate]);

  function buildRange() {
    if (allDay) {
      return {
        startAt: dayStartISO(startDate),
        endAt: dayEndISO(endDate || startDate),
      };
    }
    return {
      startAt: fromDateTimeLocal(startDateTime),
      endAt: fromDateTimeLocal(endDateTime),
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const range = buildRange();

    if (isEdit && event) {
      await updateEvent({
        variables: {
          input: {
            id: event.id,
            title: title.trim(),
            description: description.trim() || undefined,
            location: location.trim() || undefined,
            allDay,
            color,
            ...range,
          },
        },
      });
    } else {
      await createEvent({
        variables: {
          input: {
            title: title.trim(),
            description: description.trim() || undefined,
            location: location.trim() || undefined,
            allDay,
            color,
            ...range,
          },
        },
      });
    }

    onOpenChange(false);
  }

  const saving = creating || updating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit event" : "New event"}</DialogTitle>
          <DialogDescription className="sr-only">
            {isEdit ? "Update calendar event details." : "Add a new event to your calendar."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="event-title">Title</Label>
            <Input
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting, reminder…"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Input
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-location">Location</Label>
            <Input
              id="event-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="h-4 w-4 rounded border border-input accent-primary"
            />
            All day
          </label>

          {allDay ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="event-start-date">Start date</Label>
                <Input
                  id="event-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-end-date">End date</Label>
                <Input
                  id="event-end-date"
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="event-start-dt">Starts</Label>
                <Input
                  id="event-start-dt"
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-end-dt">Ends</Label>
                <Input
                  id="event-end-dt"
                  type="datetime-local"
                  value={endDateTime}
                  min={startDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={cn(
                    "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
                    color === c ? "border-foreground" : "border-transparent",
                  )}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add to calendar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
