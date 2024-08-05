// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useImperativeHandle, useState } from 'react';

import LiveRegion from '../internal/components/live-region';
import { useDebounceCallback } from '../internal/hooks/use-debounce-callback/index.js';

import styles from './styles.css.js';

// Debounce delay for live region (based on testing with VoiceOver)
const LIVE_REGION_DELAY = 2000;
const ZERO_WIDTH_CHARACTER = '.';

interface SearchResultsProps {
  id: string;
  children: string;
}

export namespace SearchResultsProps {
  export interface Ref {
    renderCountTextAriaLive(): void;
  }
}

export const SearchResults = React.forwardRef(
  ({ id, children }: SearchResultsProps, ref?: React.Ref<SearchResultsProps.Ref>) => {
    const [nextAnnouncement, setNextAnnouncement] = useState('');

    // Debounce this handler to consolidate multiple renderCountTextAriaLive calls into a single re-announcement.
    const announce = useDebounceCallback(() => {
      let announcement = '';
      if (nextAnnouncement === '') {
        setNextAnnouncement(children);
        announcement = children;
      } else {
        // Togging a ZERO_WIDTH_CHARACTER at the end of the string triggers a re-announcement of the same text in screen readers.
        announcement = nextAnnouncement.endsWith(ZERO_WIDTH_CHARACTER)
          ? nextAnnouncement.slice(0, -1)
          : nextAnnouncement + ZERO_WIDTH_CHARACTER;
      }

      console.log('announceDebounced executed', announcement);
      setNextAnnouncement(announcement);
    }, LIVE_REGION_DELAY);

    useImperativeHandle(
      ref,
      () => ({
        renderCountTextAriaLive: () => {
          console.log('announceDebounced triggered by external ref');
          announce();
        },
      }),
      [announce]
    );

    // Reset the re-announce state when a new children is passed.
    useEffect(() => {
      console.log('announceDebounced triggered in useEffect');
      setNextAnnouncement('');
      announce();
    }, [announce, children]);

    return (
      <>
        <span className={styles.results} id={id}>
          {children}
        </span>
        <LiveRegion delay={0} visible={false}>
          <span>{nextAnnouncement}</span>
        </LiveRegion>
      </>
    );
  }
);
