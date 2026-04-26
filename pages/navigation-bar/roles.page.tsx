// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import NavigationBar from '~components/navigation-bar';
import SpaceBetween from '~components/space-between';

import { primaryHorizontalContent, secondaryHorizontalContent } from './common';

export default function RolesPage() {
  return (
    <Box padding="l">
      <SpaceBetween size="xl">
        <Box variant="h1">NavigationBar — Role prop</Box>

        <div>
          <Box variant="h2" padding={{ bottom: 'xxs' }}>
            role=&quot;navigation&quot; (default) — renders &lt;nav&gt;
          </Box>
          <NavigationBar ariaLabel="Main navigation" content={primaryHorizontalContent} />
        </div>

        <div>
          <Box variant="h2" padding={{ bottom: 'xxs' }}>
            role=&quot;banner&quot; — renders &lt;header&gt;
          </Box>
          <NavigationBar
            role="banner"
            variant="primary-accent"
            ariaLabel="Site header"
            content={primaryHorizontalContent}
          />
        </div>

        <div>
          <Box variant="h2" padding={{ bottom: 'xxs' }}>
            role=&quot;region&quot; — renders &lt;section role=&quot;region&quot;&gt;
          </Box>
          <NavigationBar
            role="region"
            variant="secondary"
            ariaLabel="Actions toolbar"
            content={secondaryHorizontalContent}
          />
        </div>
      </SpaceBetween>
    </Box>
  );
}
