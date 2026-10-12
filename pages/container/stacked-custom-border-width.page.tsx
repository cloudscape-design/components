// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Container } from '~components';

import { SimplePage } from '../app/templates';

export default function StackedCustomBorderWidthContainer() {
  return (
    <SimplePage title="Stacked containers with a custom border width" screenshotArea={{}}>
      <div style={{ inlineSize: 400 }}>
        <Container
          header="First stacked container"
          variant="stacked"
          style={{ root: { borderWidth: '4px', borderColor: 'purple' } }}
        >
          Container content
        </Container>
        <Container
          header="Middle stacked container"
          variant="stacked"
          style={{ root: { borderWidth: '4px', borderColor: 'purple' } }}
        >
          Container content
        </Container>
        <Container
          header="Last stacked container"
          variant="stacked"
          style={{ root: { borderWidth: '4px', borderColor: 'purple' } }}
        >
          Container content
        </Container>
      </div>
    </SimplePage>
  );
}
