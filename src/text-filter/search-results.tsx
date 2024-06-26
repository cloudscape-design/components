// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import LiveRegion from '../internal/components/live-region';
import { useDebounceCallback } from '../internal/hooks/use-debounce-callback/index.js';

import styles from './styles.css.js';

// Debounce delay for live region (based on testing with VoiceOver)
const LIVE_REGION_DELAY = 2000;
const DOT_CHARACTER = '.';

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
    const isComponentMounted = useRef(false);

    useEffect(() => {
      isComponentMounted.current = true;
      return () => {
        isComponentMounted.current = false;
      };
    }, []);

    // Debounce this handler to consolidate multiple renderCountTextAriaLive calls into a single re-announcement.
    const announce = useDebounceCallback(() => {
      // We don't want to announce anything after the component has been unmounted.
      if (!isComponentMounted.current) {
        return;
      }

      let announcement = '';
      if (nextAnnouncement === '') {
        setNextAnnouncement(children);
        announcement = children;
      } else {
        // Togging a ZERO_WIDTH_CHARACTER at the end of the string triggers a re-announcement of the same text in screen readers.
        announcement = nextAnnouncement.endsWith(DOT_CHARACTER)
          ? nextAnnouncement.slice(0, -1)
          : nextAnnouncement + DOT_CHARACTER;
      }

      setNextAnnouncement(announcement);
    }, LIVE_REGION_DELAY);

    useImperativeHandle(
      ref,
      () => ({
        renderCountTextAriaLive: () => {
          announce();
        },
      }),
      [announce]
    );

    // Reset the re-announce state when a new children is passed.
    useEffect(() => {
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
