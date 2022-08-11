// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from './utils/screenshot-area';
import Grid from '~components/grid';

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
            { colspan: 3, push: 9 },
            { colspan: 3, pull: 3 },
            { colspan: 3 },
          ]}
        >
          {/* Test inner grid + no-gutters + numerical values for mapping */}
          <Grid disableGutters={true} gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
            <div>Inner grid / No gutters / Always half-width</div>
            <div>Inner grid / No gutters / Always half-width</div>
          </Grid>

          <div>Grid column w/ medium-only offset</div>

          <div>First semantic column</div>
          <div>Second semantic column</div>
          <div>Third semantic column</div>
        </Grid>
      </ScreenshotArea>
    </>
  );
}
