// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import range from 'lodash/range';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ColumnLayout, { ColumnLayoutProps } from '~components/column-layout';

const permutations = createPermutations<ColumnLayoutProps>([
  {
    variant: ['default'],
    disableGutters: [false, true],
    columns: [1, 2, 3, 4],
    minColumnWidth: [150],
  },
  {
    variant: ['text-grid'],
    columns: [1, 2, 3, 4],
    minColumnWidth: [200],
  },
]);

export default function ColumnLayoutPermutationsPage() {
  return (
    <>
      <h1>Column layout (minColumnWidth) permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div>
              {range(0, (permutation.columns ?? 0) * 2).map(j => (
                <div key={j} style={{ margin: '1rem', border: '1px solid #000000' }}>
                  <ColumnLayout {...permutation}>
                    {range(0, j + 2).map(k => (
                      <span key={k}>
                        {permutation.columns}-col {permutation.variant}, col #{k + 1}.
                      </span>
                    ))}
                  </ColumnLayout>
                </div>
              ))}
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
