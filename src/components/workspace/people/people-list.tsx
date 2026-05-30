"use client";

import { Users } from "lucide-react";
import type { WorkspaceCollaborator } from "@/graphql/types";
import { PersonRow } from "./person-row";

type RowAction = Parameters<typeof PersonRow>[0]["action"];

export function PeopleList({
  title,
  count,
  people,
  emptyTitle,
  emptyHint,
  getAction,
}: {
  title: string;
  count?: number;
  people: WorkspaceCollaborator[];
  emptyTitle: string;
  emptyHint: string;
  getAction?: (person: WorkspaceCollaborator) => RowAction | undefined;
}) {
  if (people.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-muted/10 px-4 py-8 text-center">
        <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">{emptyTitle}</p>
        <p className="mt-1 text-xs text-muted-foreground/80">{emptyHint}</p>
      </div>
    );
  }

  return (
    <section className="space-y-1">
      <h3 className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
        {count !== undefined ? ` · ${count}` : ""}
      </h3>
      <ul className="space-y-0.5">
        {people.map((person) => (
          <PersonRow
            key={`${person.id}-${person.email}-${person.status}`}
            person={person}
            action={getAction?.(person)}
          />
        ))}
      </ul>
    </section>
  );
}
