import { serializeBlockContent } from "@/lib/content";

export type PageStarter = {
  id: string;
  name: string;
  description: string;
  title: string;
  content: string;
};

export const BLANK_PAGE_STARTER: PageStarter = {
  id: "blank",
  name: "Blank page",
  description: "Empty page ready to write",
  title: "Untitled",
  content: "",
};

export const PAGE_STARTERS: PageStarter[] = [
  BLANK_PAGE_STARTER,
  {
    id: "meeting-notes",
    name: "Meeting notes",
    description: "Agenda, notes, and action items",
    title: "Meeting notes",
    content: serializeBlockContent([
      { type: "heading", props: { level: 2 }, content: "Agenda" },
      { type: "bulletListItem", content: "Topic 1" },
      { type: "heading", props: { level: 2 }, content: "Notes" },
      { type: "paragraph", content: "Key discussion points…" },
      { type: "heading", props: { level: 2 }, content: "Action items" },
      { type: "bulletListItem", content: "Owner — task" },
    ]),
  },
  {
    id: "weekly-review",
    name: "Weekly review",
    description: "Wins and priorities for next week",
    title: "Weekly review",
    content: serializeBlockContent([
      { type: "heading", props: { level: 2 }, content: "Wins" },
      { type: "bulletListItem", content: "What went well?" },
      { type: "heading", props: { level: 2 }, content: "Next week" },
      { type: "bulletListItem", content: "Top priority" },
    ]),
  },
  {
    id: "project-brief",
    name: "Project brief",
    description: "Problem, scope, and success criteria",
    title: "Project brief",
    content: serializeBlockContent([
      { type: "heading", props: { level: 2 }, content: "Problem" },
      { type: "paragraph", content: "What problem are we solving?" },
      { type: "heading", props: { level: 2 }, content: "Success" },
      { type: "paragraph", content: "How we will measure success." },
    ]),
  },
];
