// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Container from '~components/container';
import Skeleton from '~components/skeleton';
import SpaceBetween from '~components/space-between';

export default function SkeletonSimple() {
  return (
    <article>
      <h1>Skeleton demo page</h1>
      <SpaceBetween size="l">
        <Container header={<h2>Default skeleton</h2>}>
          <SpaceBetween size="m">
            <Skeleton />
            <p>Default skeleton with no properties (100% width, 3em height)</p>
          </SpaceBetween>
        </Container>

        <Container header={<h2>Custom dimensions</h2>}>
          <SpaceBetween size="m">
            <Skeleton height="50px" width="300px" />
            <p>Fixed dimensions: 50px height, 300px width</p>
          </SpaceBetween>
        </Container>

        <Container header={<h2>Percentage width</h2>}>
          <SpaceBetween size="m">
            <Skeleton height="60px" width="75%" />
            <p>Responsive width: 75% of container</p>
          </SpaceBetween>
        </Container>

        <Container header={<h2>Custom border radius</h2>}>
          <SpaceBetween size="m">
            <Skeleton height="100px" width="100px" style={{ root: { borderRadius: '50%' } }} />
            <p>Circular skeleton with custom border radius</p>
          </SpaceBetween>
        </Container>

        <Container header={<h2>Custom background</h2>}>
          <SpaceBetween size="m">
            <Skeleton
              height="80px"
              width="400px"
              style={{
                root: {
                  background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                  borderRadius: '12px',
                },
              }}
            />
            <p>Custom gradient background and border radius</p>
          </SpaceBetween>
        </Container>

        <Container header={<h2>Multiple skeletons (simulating content loading)</h2>}>
          <SpaceBetween size="s">
            <Skeleton height="24px" width="200px" />
            <Skeleton height="16px" width="100%" />
            <Skeleton height="16px" width="100%" />
            <Skeleton height="16px" width="80%" />
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </article>
  );
}
