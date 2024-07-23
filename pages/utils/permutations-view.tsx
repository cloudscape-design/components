// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import SpaceBetween from '~components/space-between';

interface PermutationsViewProps<T> {
  permutations: ReadonlyArray<T>;
  render: (props: T) => React.ReactElement;
}

function formatValue(key: string, value: any) {
  if (typeof value === 'function') {
    return value.toString();
  }
  if (value && value.$$typeof) {
    // serialize React content to string
    // TODO: Pretty-print original JSX, currently this are bare VDOM nodes
    return JSON.stringify(value);
  }
  return value;
}

export default function PermutationsView<T>({ permutations, render }: PermutationsViewProps<T>) {
  return (
    <SpaceBetween size="m">
      {permutations.map(permutation => {
        const id = JSON.stringify(permutation, formatValue);
        return (
          <div key={id} data-permutation={id}>
            {render(permutation)}
          </div>
        );
      })}
    </SpaceBetween>
  );
}
