// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Container } from '~components';

import { SimplePage } from '../app/templates';

// Stacked containers with a custom border radius. Outer corners use the radius; adjacent
// corners stay flat. Drives the stacked-custom-radius integ test.
export default function StackedCustomRadiusContainer() {
  return (
    <SimplePage title="Stacked containers with a custom border radius" screenshotArea={{}}>
      <div style={{ inlineSize: 400 }}>
        <Container
          data-testid="bg-first"
          header="First stacked container"
          variant="stacked"
          style={{ root: { borderRadius: '24px', background: '#f0f8ff' } }}
        >
          Container content
        </Container>
        <Container
          data-testid="bg-middle"
          header="Middle stacked container"
          variant="stacked"
          style={{ root: { borderRadius: '24px', background: '#fff8f0' } }}
        >
          Container content
        </Container>
        <Container
          data-testid="bg-last"
          header="Last stacked container"
          variant="stacked"
          style={{ root: { borderRadius: '24px', background: '#f0fff8' } }}
        >
          Container content
        </Container>
      </div>
    </SimplePage>
  );
}
