// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useImperativeHandle, useState } from 'react';
import styles from './styles.css.js';
import LiveRegion from '../internal/components/live-region';

// Debounce delay for live region (based on testing with VoiceOver)
const LIVE_REGION_DELAY = 2000;

interface SearchResultsProps {
  id: string;
  children: string;
}

export namespace SearchResultsProps {
  export interface Ref {
    reannounceCountText(): void;
  }
}

export const SearchResults = React.forwardRef(
  ({ id, children }: SearchResultsProps, ref?: React.Ref<SearchResultsProps.Ref>) => {
    const [reannounceToggle, setReannounceToggle] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        reannounceCountText: () => {
          setReannounceToggle(prevCheck => !prevCheck);
        },
      }),
      []
    );

    return (
      <>
        <span className={styles.results}>{children}</span>
        <LiveRegion delay={LIVE_REGION_DELAY} visible={false}>
          <span id={id}>{`${children}${reannounceToggle ? '.' : ''}`}</span>
        </LiveRegion>
      </>
    );
  }
);
