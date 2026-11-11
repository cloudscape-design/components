// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import SpaceBetween from '~components/space-between';

interface PermutationsViewProps<T> {
  permutations: ReadonlyArray<T>;
  render: (props: T, index?: number) => React.ReactElement;
}

function formatValue(key: string, value: any) {
  if (typeof value === 'function') {
    // Function source changes with minification, so it would make the permutation ID differ between builds.
    return '[function]';
  }
  if (value && value.$$typeof) {
    // serialize React content to string
    // TODO: Pretty-print original JSX, currently this are bare VDOM nodes
    return JSON.stringify(value);
  }
  return value;
}

const maximumPermutations = 276;

export default function PermutationsView<T>({ permutations, render }: PermutationsViewProps<T>) {
  if (permutations.length > maximumPermutations) {
    throw new Error(`Too many permutations (${permutations.length}), maximum is ${maximumPermutations}`);
  }

  // Permutations that differ only by a function prop get the same base ID, so number the repeats to keep IDs unique.
  const idCounts = new Map<string, number>();

  return (
    <SpaceBetween size="m">
      {permutations.map((permutation, index) => {
        const baseId = JSON.stringify(permutation, formatValue);
        const repeat = idCounts.get(baseId) ?? 0;
        idCounts.set(baseId, repeat + 1);
        // The ID must stay valid JSON, because the screenshot tests parse it.
        const id = repeat === 0 ? baseId : JSON.stringify({ ...permutation, $repeat: repeat }, formatValue);
        return (
          <div key={id} data-permutation={id}>
            {render(permutation, index)}
          </div>
        );
      })}
    </SpaceBetween>
  );
}
