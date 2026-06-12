// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Alert, Badge, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2-encapsulation.scss';

// Proves the shared-token model:
//  1. DEDUP — the same `.shared-accent` style themes BOTH the Alert and the standalone Badge.
//  2. ENCAPSULATION — the Badge nested inside the themed Alert is NOT affected by the Alert's
//     shared tokens (inherits:false + per-root carrier reset), so it renders with its default look
//     unless it is itself given the class.
export default function StyleV2EncapsulationPage() {
  return (
    <SimplePage title="Shared-token util: dedup + encapsulation" screenshotArea={{}}>
      <SpaceBetween size="l">
        <Alert type="info" header="Themed alert" classNames={{ root: styles['shared-accent'] }}>
          This alert is themed by <code>.shared-accent</code>. The badge below is nested inside it but has no class — it
          must keep its default look (no leak).
          <div style={{ marginBlockStart: 8 }}>
            <SpaceBetween size="xs" direction="horizontal">
              <Badge color="blue">Nested, unstyled (should stay default)</Badge>
              <Badge color="blue" classNames={{ root: styles['shared-accent'] }}>
                Nested + .shared-accent (themed)
              </Badge>
            </SpaceBetween>
          </div>
        </Alert>

        <Badge color="blue" classNames={{ root: styles['shared-accent'] }}>
          Standalone badge + the SAME .shared-accent style (dedup)
        </Badge>
      </SpaceBetween>
    </SimplePage>
  );
}
