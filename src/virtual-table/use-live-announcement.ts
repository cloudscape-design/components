// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useRef, useState } from 'react';

// Rate-limited, coalesced live-append announcement for the headless core (impl-F3-A2-core).
// The core owns the debounce (~500ms) and the aria-live region; the consumer supplies the
// message text via `renderAppendAnnouncement`. Bursts of appends within the window collapse
// into ONE polite message per batch (so a live-tail stream does not spam a screen reader),
// tallying the total added since the last flush. A shrink/replace (delta <= 0) resets the
// tally and announces nothing. Returns the current coalesced `message` (rendered into the
// core's live region by the consumer) and an explicit `announce` escape hatch.

const APPEND_DEBOUNCE_MS = 500;

interface UseLiveAnnouncementParams {
  totalCount: number;
  /** Formats the coalesced batch. Returning undefined suppresses the announcement. */
  renderAppendAnnouncement?: (detail: { addedCount: number; totalCount: number }) => string | undefined;
}

export interface LiveAnnouncement {
  message: string;
  announce: (detail: { addedCount: number; totalCount: number }) => void;
}

export function useLiveAnnouncement({
  totalCount,
  renderAppendAnnouncement,
}: UseLiveAnnouncementParams): LiveAnnouncement {
  const [message, setMessage] = useState('');
  const pendingAdded = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevTotal = useRef(totalCount);
  const latest = useRef(renderAppendAnnouncement);
  latest.current = renderAppendAnnouncement;

  const flush = useCallback((total: number) => {
    const added = pendingAdded.current;
    pendingAdded.current = 0;
    if (added <= 0) {
      return;
    }
    const next = latest.current?.({ addedCount: added, totalCount: total });
    if (next) {
      setMessage(next);
    }
  }, []);

  const schedule = useCallback(
    (total: number) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        timer.current = null;
        flush(total);
      }, APPEND_DEBOUNCE_MS);
    },
    [flush]
  );

  const announce = useCallback(
    (detail: { addedCount: number; totalCount: number }) => {
      if (detail.addedCount <= 0) {
        pendingAdded.current = 0;
        return;
      }
      pendingAdded.current += detail.addedCount;
      schedule(detail.totalCount);
    },
    [schedule]
  );

  // Auto-detect dataset growth (the streaming/live-tail path). A shrink or replace resets.
  useEffect(() => {
    const delta = totalCount - prevTotal.current;
    prevTotal.current = totalCount;
    if (delta > 0) {
      pendingAdded.current += delta;
      schedule(totalCount);
    } else if (delta < 0) {
      pendingAdded.current = 0;
    }
  }, [totalCount, schedule]);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return { message, announce };
}
