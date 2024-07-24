// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ColumnLayout, { ColumnLayoutProps } from '~components/column-layout';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

function range(start: number, end: number) {
  const array = [];
  for (let i = start; i < end; i++) {
    array.push(i);
  }
  return array;
}

const permutations = createPermutations<ColumnLayoutProps>([
  {
    variant: ['default'],
    borders: ['horizontal', 'vertical', 'all'],
    columns: [1, 2, 3, 4],
  },
  {
    variant: ['text-grid'],
    columns: [1, 2, 3, 4],
  },
]);

export default function ColumnLayoutPermutationsPage() {
  return (
    <>
      <h1>Column layout permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div>
              {range(0, (permutation.columns ?? 0) * 2).map(j => (
                <div key={j} style={{ margin: '1rem', border: '1px solid #000000' }}>
                  <ColumnLayout {...permutation}>
                    {range(0, j + 1).map(k => (
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
