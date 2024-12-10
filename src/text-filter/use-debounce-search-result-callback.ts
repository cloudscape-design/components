// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef } from 'react';

import { useDebounceCallback } from '../internal/hooks/use-debounce-callback';

interface DebouncedLiveAnnouncementProps {
  searchQuery: any; // We listen to changes on that parameter.
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
  const isLoadingRef = useRef(loading);
  const debounceLiveAnnouncement = useDebounceCallback(() => {
    if (!countText || isLoadingRef.current) {
      return;
    }
    announceCallback();
  }, LIVE_REGION_DELAY);

  // Live announce result count:
  // - For sync filters: on searchQuery/countText changes.
  // - For async filters: on searchQuery/countText when loading completed and countText exists.
  useEffect(() => {
    isLoadingRef.current = loading;
    if (!loading) {
      debounceLiveAnnouncement();
    }
  }, [searchQuery, countText, loading, debounceLiveAnnouncement]);
}
