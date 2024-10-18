// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import InternalLiveRegion from '../internal/components/live-region/internal';

import styles from './styles.css.js';

// Debounce delay for live region (based on testing with VoiceOver)
const LIVE_REGION_DELAY = 2000;

interface SearchResultsProps {
  id: string;
  children: string;
}

export function SearchResults({ id, children }: SearchResultsProps) {
  return (
    <span className={styles.results}>
      <InternalLiveRegion delay={LIVE_REGION_DELAY} tagName="span">
        <span id={id}>{children}</span>
      </InternalLiveRegion>
    </span>
  );
}
