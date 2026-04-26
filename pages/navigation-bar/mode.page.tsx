// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import NavigationBar from '~components/navigation-bar';
import SpaceBetween from '~components/space-between';

import { primaryHorizontalContent, primaryVerticalContent } from './common';

export default function ModePage() {
  return (
    <Box padding="l">
      <SpaceBetween size="xl">
        <Box variant="h1">primary-accent — dark/branded appearance</Box>

        <div>
          <Box variant="h2" padding={{ bottom: 'xxs' }}>
            Primary-accent (horizontal)
          </Box>
          <NavigationBar
            variant="primary-accent"
            ariaLabel="Primary accent horizontal"
            content={primaryHorizontalContent}
          />
        </div>

        <div>
          <Box variant="h2" padding={{ bottom: 'xxs' }}>
            Primary-accent (vertical start)
          </Box>
          <div style={{ display: 'flex', height: '300px' }}>
            <NavigationBar
              variant="primary-accent"
              placement="start"
              ariaLabel="Primary accent vertical"
              content={primaryVerticalContent}
            />
            <Box padding="m" color="text-body-secondary">
              Content area
            </Box>
          </div>
        </div>
      </SpaceBetween>
    </Box>
  );
}
