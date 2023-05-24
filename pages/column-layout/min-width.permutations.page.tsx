// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ColumnLayout, { ColumnLayoutProps } from '~components/column-layout';

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
    minColumnWidth: [50, 150, 200],
  },
  {
    variant: ['text-grid'],
    minColumnWidth: [50, 150, 200],
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
              {range(0, 6).map(j => (
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
