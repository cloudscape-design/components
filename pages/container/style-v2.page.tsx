// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Container } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2ContainerPage() {
  return (
    <SimplePage title="Container with Style API v2" screenshotArea={{}}>
      <Container classNames={{ root: styles['container-outer'] }} header="Level 1 with header and border radius styles">
        <Container classNames={{ root: styles['container-inner'] }} header="Level 2 with different header styles">
          <Container variant="stacked" header="Level 3 without style overrides — not affected by Level 1/2 styles">
            Content
          </Container>
        </Container>
      </Container>
    </SimplePage>
  );
}
