import { serializeBlockContent } from "@/lib/content";

export type NoteTemplate = {
  id: string;
  name: string;
  description: string;
  title: string;
  content: string;
  tags: string[];
};

export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: "quick-notes",
    name: "Quick Notes",
    description: "Meeting notes with checklist and brief",
    title: "Quick Notes",
    content: serializeBlockContent([
      {
        type: "paragraph",
        content:
          "We are a company that helps people build their own businesses. We provide tools, resources, and support to help entrepreneurs succeed.",
      },
      { type: "heading", props: { level: 2 }, content: "Brief" },
      {
        type: "paragraph",
        content:
          "Outline goals, timeline, and deliverables for this project.",
      },
    ]),
    tags: ["morning", "ideas"],
  },
  {
    id: "weekly-review",
    name: "Weekly review",
    description: "Reflect on wins and plan next week",
    title: "Weekly review",
    content: serializeBlockContent([
      { type: "heading", props: { level: 2 }, content: "Wins" },
      { type: "bulletListItem", content: "What went well?" },
      { type: "heading", props: { level: 2 }, content: "Next week" },
      { type: "bulletListItem", content: "Top priority" },
    ]),
    tags: ["todo's"],
  },
  {
    id: "project-brief",
    name: "Project brief",
    description: "Scope, audience, and success metrics",
    title: "Project brief",
    content: serializeBlockContent([
      { type: "paragraph", content: "Problem statement" },
      {
        type: "paragraph",
        content: "Describe the problem you are solving.",
      },
    ]),
    tags: ["ideas"],
  },
];
