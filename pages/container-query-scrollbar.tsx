// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Grid from '~components/grid';

const ARTICLE =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ' +
  'labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco ' +
  'laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in ' +
  'voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat ' +
  'non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis ' +
  'unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, ' +
  'eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt ' +
  'explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia ' +
  'consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, ' +
  'qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius ' +
  'modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.';

export default function GridScrollbarOscillationSimplePage() {
  return (
    <>
      <h1>Grid scrollbar oscillation (AWSUI-62065)</h1>
      <p style={{ maxInlineSize: 720 }}>
        Slowly resize the window width around <code>1120px</code>. The window should be short enough that vertical
        scrollbars just start to appear on the wider breakpoint. Side by side, the text column is squeezed and wraps
        tall enough to show a scrollbar; stacked, it gets the full width, becomes shorter, and the scrollbar disappears
        — flipping the layout back and forth.
      </p>

      <Grid
        gridDefinition={[
          { colspan: { default: 12, m: 6 } }, // long text column
          { colspan: { default: 12, m: 6 } }, // short side column
        ]}
      >
        <div style={{ border: '1px solid #879596', borderRadius: 8, padding: 16, background: '#f1faff' }}>
          {ARTICLE}
        </div>
        <div style={{ border: '1px solid #879596', borderRadius: 8, padding: 16, background: '#f7f7f7' }}>
          Summary — a short side column
        </div>
      </Grid>
    </>
  );
}
