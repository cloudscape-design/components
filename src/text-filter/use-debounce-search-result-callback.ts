// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef } from 'react';

import { useDebounceCallback } from '../internal/hooks/use-debounce-callback';

export interface DebouncedLiveAnnouncementProps {
  searchQuery: any;
  countText: string | undefined;
  loading: boolean;
  announceCallback: () => void;
}

// Debounce delay for live region (based on testing with VoiceOver)
const LIVE_REGION_DELAY = 2000;

export default function useDebounceSearchResultCallback({
  searchQuery,
  countText,
  loading,
  announceCallback,
}: DebouncedLiveAnnouncementProps) {
  const loadingRef = useRef(loading);

  // announceCallback is called when:
  // - For sync filters: on searchQuery/countText changes.
  // - For async filters: on searchQuery/countText when loading completed and countText exists.
  const debounceLiveAnnouncement = useDebounceCallback(() => {
    if (!countText || loadingRef.current) {
      return;
    }
    announceCallback();
  }, LIVE_REGION_DELAY);

  useEffect(() => {
    loadingRef.current = loading;
    debounceLiveAnnouncement();
  }, [searchQuery, countText, loading, debounceLiveAnnouncement]);
}
