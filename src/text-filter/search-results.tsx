// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useImperativeHandle, useRef } from 'react';

import InternalLiveRegion, { InternalLiveRegionRef } from '../live-region/internal';

import styles from './styles.css.js';

// Debounce delay for live region (based on testing with VoiceOver)
const LIVE_REGION_DELAY = 2000;

interface SearchResultsProps {
  id: string;
  children: string;
  renderLiveRegion?: boolean;
}

export const SearchResults = React.forwardRef(
  ({ id, renderLiveRegion, children }: SearchResultsProps, ref?: React.Ref<InternalLiveRegionRef>) => {
    const liveRegionRef = useRef<InternalLiveRegionRef>(null);

    useImperativeHandle(
      ref,
      () => ({
        reannounce: () => {
          console.log('LIVE Announce!');
          liveRegionRef.current?.reannounce();
        },
      }),
      []
    );

    return (
      <>
        <span className={styles.results} id={id}>
          {children}
        </span>
        {renderLiveRegion && (
          <InternalLiveRegion delay={LIVE_REGION_DELAY} tagName="span" hidden={true} ref={liveRegionRef}>
            {children}
          </InternalLiveRegion>
        )}
      </>
    );
  }
);
