import { splitHighlight } from "@/lib/search";

export function SearchHighlight({ text, query }: { text: string; query: string }) {
  const parts = splitHighlight(text, query);
  if (!parts) return <>{text}</>;
  return (
    <>
      {parts.before}
      <mark className="rounded-sm bg-primary/20 px-0.5 text-foreground">
        {parts.match}
      </mark>
      {parts.after}
    </>
  );
}
