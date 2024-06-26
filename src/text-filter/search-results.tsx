// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import { useDebounceCallback } from '../internal/hooks/use-debounce-callback';
import InternalLiveRegion, { InternalLiveRegionRef } from '../live-region/internal';

import styles from './styles.css.js';

// Debounce delay for live region (based on testing with VoiceOver)
const LIVE_REGION_DELAY = 2000;

interface SearchResultsProps {
  id: string;
  children: string;
}

export const SearchResults = React.forwardRef(
  ({ id, children }: SearchResultsProps, ref?: React.Ref<InternalLiveRegionRef>) => {
    const [announcementText, setAnnouncementText] = useState('');
    const isComponentMounted = useRef(false);
    const liveRegionRef = useRef<InternalLiveRegionRef>(null);

    useEffect(() => {
      isComponentMounted.current = true;
      return () => {
        isComponentMounted.current = false;
      };
    }, []);

    // Consolidate multiple re-announce calls into a single re-announcement.
    const announceDebounced = useDebounceCallback(() => {
      if (!isComponentMounted.current) {
        return;
      }
      setAnnouncementText(children);
      liveRegionRef.current?.reannounce();
    }, LIVE_REGION_DELAY);

    useImperativeHandle(
      ref,
      () => ({
        reannounce: () => {
          announceDebounced();
        },
      }),
      [announceDebounced]
    );

    useEffect(() => {
      setAnnouncementText('');
      announceDebounced();
    }, [announceDebounced, children]);

    return (
      <>
        <span className={styles.results}>
          <span id={id}>{children}</span>
        </span>
        <InternalLiveRegion delay={LIVE_REGION_DELAY} tagName="span" ref={liveRegionRef} hidden={true}>
          {announcementText}
        </InternalLiveRegion>
      </>
    );
  }
);
