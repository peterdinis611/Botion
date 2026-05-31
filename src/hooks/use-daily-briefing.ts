"use client";

import { useQuery, useSubscription } from "@apollo/client/react";
import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import {
  APP_EVENT_SUBSCRIPTION,
  DAILY_BRIEFING_QUERY,
} from "@/graphql/operations";
import type { AppEventPayload, DailyBriefingQueryResult } from "@/graphql/types";

const BRIEFING_ACTIONS = [
  "NOTE_CREATED",
  "NOTE_UPDATED",
  "NOTE_DELETED",
  "CALENDAR_EVENT_CREATED",
  "CALENDAR_EVENT_UPDATED",
  "CALENDAR_EVENT_DELETED",
] as const;

export function useDailyBriefing(dateKey: string) {
  const { isReady, isAuthenticated } = useAuth();
  const refetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, loading, refetch, networkStatus } = useQuery<DailyBriefingQueryResult>(
    DAILY_BRIEFING_QUERY,
    {
      variables: { date: dateKey },
      skip: !isReady || !isAuthenticated,
      fetchPolicy: "cache-and-network",
    },
  );

  const scheduleRefetch = useCallback(() => {
    if (refetchTimer.current) clearTimeout(refetchTimer.current);
    refetchTimer.current = setTimeout(() => {
      void refetch();
    }, 300);
  }, [refetch]);

  useEffect(() => {
    return () => {
      if (refetchTimer.current) clearTimeout(refetchTimer.current);
    };
  }, []);

  const shouldSubscribe = isReady && isAuthenticated;

  useSubscription<AppEventPayload>(APP_EVENT_SUBSCRIPTION, {
    skip: !shouldSubscribe,
    variables: { actions: [...BRIEFING_ACTIONS] },
    onData: () => {
      scheduleRefetch();
    },
  });

  return {
    briefing: data?.dailyBriefing,
    loading: loading && networkStatus !== 4,
    refetch,
  };
}
