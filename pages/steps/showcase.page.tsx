// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Icon, SpaceBetween } from '~components';
import Box from '~components/box';
import Header from '~components/header';
import Steps from '~components/steps';

import { loadingSteps2Interactive } from './permutations-utils';

export default function StepsPermutationsWithUpdates() {
  return (
    <article>
      <Box padding="l">
        <SpaceBetween size="l">
          <Header variant="h2">Hobbes use-case</Header>
          <Steps
            orientation="horizontal"
            renderStep={step => {
              if (step.status === 'stopped') {
                return {
                  details: step.header,
                  header: (
                    <Icon
                      variant="error"
                      svg={
                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="8" cy="8" r="7" />
                        </svg>
                      }
                    />
                  ),
                };
              }
              return {
                header: <Icon name="status-positive" />,
                details: step.header,
              };
            }}
            steps={[
              {
                status: 'success',
                header: 'Pre-flight',
              },
              {
                status: 'success',
                header: 'Static analysis',
              },
              {
                status: 'success',
                header: 'Pentest execution',
              },

              {
                status: 'loading',
                header: 'Finalizing',
              },
              {
                status: 'stopped',
                header: 'Complete',
              },
            ]}
          />

          <Header variant="h2">With status indicator, vertical</Header>
          <Steps steps={loadingSteps2Interactive} />
          <Header variant="h2">With status indicator, horizontal</Header>
          <Steps steps={loadingSteps2Interactive} orientation="horizontal" />
          <Header variant="h2">With custom icon, vertical</Header>
          <Steps steps={loadingSteps2Interactive.map(step => ({ ...step, iconName: 'folder-open' }))} />
          <Header variant="h2">With custom icon, horizontal</Header>
          <Steps
            steps={loadingSteps2Interactive.map(step => ({ ...step, iconName: 'folder-open' }))}
            orientation="horizontal"
          />
          <Header variant="h2">With custom icon, no status, vertical</Header>
        </SpaceBetween>
      </Box>
    </article>
  );
}
