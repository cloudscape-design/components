// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import NavigationBar from '~components/navigation-bar';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';
import { primaryHorizontalContent, secondaryHorizontalContent } from './common';

export default function NavigationBarSimplePage() {
  return (
    <SimplePage title="NavigationBar — Simple">
      <SpaceBetween size="l">
        <Box>
          <Box variant="h2">Primary (light)</Box>
          <Box variant="p" color="text-body-secondary">
            Default page-matching header. Child components keep their normal colors.
          </Box>
          <NavigationBar variant="primary" ariaLabel="Primary nav" content={primaryHorizontalContent} />
        </Box>

        <Box>
          <Box variant="h2">Primary accent (inverted)</Box>
          <Box variant="p" color="text-body-secondary">
            Branded dark header. Child components adapt via the navigation-bar visual context.
          </Box>
          <NavigationBar variant="primary-accent" ariaLabel="Primary accent nav" content={primaryHorizontalContent} />
        </Box>

        <Box>
          <Box variant="h2">Secondary</Box>
          <Box variant="p" color="text-body-secondary">
            Neutral toolbar style matching the AppLayout toolbar.
          </Box>
          <NavigationBar variant="secondary" ariaLabel="Secondary toolbar" content={secondaryHorizontalContent} />
        </Box>
      </SpaceBetween>
    </SimplePage>
  );
}
