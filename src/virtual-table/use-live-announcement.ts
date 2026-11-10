// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef, useState } from 'react';

const APPEND_DEBOUNCE_MS = 500;

// Coalesces streaming appends into a single polite announcement per burst. F2 owns live
// tail, so the component owns the debounce + aria-live region; the console supplies only
// the message text (renderAppendAnnouncement / i18nStrings.appendAnnouncementText). A
// high-rate tail announces "N new log events" once per ~500 ms batch, not once per row.
export function useLiveAnnouncement(
  totalCount: number,
  appendAnnouncement?: (detail: { addedCount: number; totalCount: number }) => string | undefined
): string {
  const [message, setMessage] = useState('');
  const previousCount = useRef(totalCount);
  const pendingAdded = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const delta = totalCount - previousCount.current;
    previousCount.current = totalCount;

    // Only appends are announced; a shrink/replace resets the running tally.
    if (delta <= 0) {
      pendingAdded.current = 0;
      return;
    }
    if (!appendAnnouncement) {
      return;
    }
    pendingAdded.current += delta;

    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      const added = pendingAdded.current;
      pendingAdded.current = 0;
      const next = appendAnnouncement({ addedCount: added, totalCount });
      if (next !== undefined) {
        // Toggle a trailing zero-width space when the text repeats so the SR re-announces.
        setMessage(prev => (prev === next ? next + '\u200b' : next));
      }
    }, APPEND_DEBOUNCE_MS);
  }, [totalCount, appendAnnouncement]);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return message;
}
