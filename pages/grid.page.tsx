// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Grid from '~components/grid';

import ScreenshotArea from './utils/screenshot-area';

export default function GridPage() {
  return (
    <>
      <h1>Grid demo</h1>
      <ScreenshotArea>
        <Grid
          gridDefinition={[
            // Inner grid
            { colspan: 12 },

            // Test offset
            { colspan: { default: 12, m: 6 }, offset: { m: 6 } },

            // Test push and pull
            { colspan: 6, push: 6 },
            { colspan: 6, pull: 6 },
          ]}
        >
          {/* Test inner grid + no-gutters + numerical values for mapping */}
          <Grid disableGutters={true} gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
            <div>Inner Grid / No Gutters / Always Half-Width</div>
            <div>Inner Grid / No Gutters / Always Half-Width</div>
          </Grid>

          <div>Grid Column w/ Offset</div>

          <div>first semantic column</div>
          <div>second semantic column</div>
        </Grid>
      </ScreenshotArea>
    </>
  );
}
