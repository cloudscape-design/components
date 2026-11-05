// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Divider, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

export default function () {
  return (
    <SimplePage title="Divider - Style API v2" screenshotArea={{}}>
      <SpaceBetween size="s">
        <Divider {...{ styleClassNames: { root: styles['divider-labelled'] } }}>
          <span className={styles.label}>Section</span>
        </Divider>
        <SpaceBetween direction="horizontal" size="s">
          <span>Left</span>
          <Divider orientation="vertical" {...{ styleClassNames: { root: styles['divider-brand'] } }} />
          <span>Right</span>
        </SpaceBetween>
        <Divider orientation="horizontal" {...{ styleClassNames: { root: styles['divider-brand'] } }} />
      </SpaceBetween>
    </SimplePage>
  );
}
