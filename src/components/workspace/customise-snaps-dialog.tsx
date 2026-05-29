"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ME_QUERY, UPDATE_MY_PREFERENCES_MUTATION } from "@/graphql/operations";
import type { MeQueryResult, UpdateMyPreferencesResult } from "@/graphql/types";
import { useEffect, useState } from "react";

export function CustomiseSnapsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data } = useQuery<MeQueryResult>(ME_QUERY);
  const prefs = data?.me?.preferences.snapsPanel;

  const [showCaptions, setShowCaptions] = useState(true);
  const [compactCards, setCompactCards] = useState(false);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const [updatePrefs, { loading }] = useMutation<UpdateMyPreferencesResult>(
    UPDATE_MY_PREFERENCES_MUTATION,
    { refetchQueries: [{ query: ME_QUERY }] },
  );

  useEffect(() => {
    if (!open || !prefs) return;
    setShowCaptions(prefs.showCaptions);
    setCompactCards(prefs.compactCards);
    setSortNewestFirst(prefs.sortNewestFirst);
  }, [open, prefs]);

  async function handleSave() {
    await updatePrefs({
      variables: {
        input: {
          snapsPanel: { showCaptions, compactCards, sortNewestFirst },
        },
      },
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Customise panel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span className="text-sm">Show captions under snaps</span>
            <input
              type="checkbox"
              checked={showCaptions}
              onChange={(e) => setShowCaptions(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span className="text-sm">Compact card size</span>
            <input
              type="checkbox"
              checked={compactCards}
              onChange={(e) => setCompactCards(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span className="text-sm">Newest snaps first</span>
            <input
              type="checkbox"
              checked={sortNewestFirst}
              onChange={(e) => setSortNewestFirst(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => void handleSave()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
