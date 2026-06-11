// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Grid from '@cloudscape-design/components/grid';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';

function HeroHeader() {
  return (
    <Box data-testid="hero-header" padding={{ top: 'xs', bottom: 'l' }}>
      <Grid gridDefinition={[{ colspan: { default: 12, xs: 8, s: 9 } }, { colspan: { default: 12, xs: 4, s: 3 } }]}>
        <div>
          <Box variant="h1">Cloud Data Solution</Box>
          <Box variant="p" margin={{ top: 'xxs', bottom: 's' }}>
            Delivering data insights and analytics to make decisions quickly, and at scale. Enhance your next step
            decision-making through actionable insights with a free trial today.
          </Box>
          <SpaceBetween size="xs">
            <div>
              Sold by:{' '}
              <Link variant="primary" href="#" external={true}>
                Cloud Data
              </Link>
            </div>
            <div>Tags: Free trial | Vendor insights | Quick launch</div>
          </SpaceBetween>
        </div>

        <Box margin={{ top: 'l' }}>
          <SpaceBetween size="s">
            <Button variant="primary" fullWidth={true}>
              View purchase options
            </Button>
            <Button fullWidth={true}>Try for free</Button>
          </SpaceBetween>
        </Box>
      </Grid>
    </Box>
  );
}

export { HeroHeader };
