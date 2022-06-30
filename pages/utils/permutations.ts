// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import flatten from 'lodash/flatten';

export type ComponentPermutations<Props> = {
  [prop in keyof Props]: ReadonlyArray<Props[prop]>;
};

export default function createPermutations<Props>(permutations: Array<ComponentPermutations<Props>>) {
  return flatten(permutations.map(set => doCreatePermutations(set)));
}

function doCreatePermutations<Props>(permutations: ComponentPermutations<Props>) {
  const result: Props[] = [];
  const propertyNames = Object.keys(permutations) as Array<keyof Props>;

  function addPermutations(remainingPropertyNames: Array<keyof Props>, currentPropertyValues: Partial<Props>) {
    if (remainingPropertyNames.length === 0) {
      result.push({ ...currentPropertyValues } as Props);
      return;
    }

    const propertyName = remainingPropertyNames[0];

    permutations[propertyName].forEach(propertyValue => {
      currentPropertyValues[propertyName] = propertyValue;
      addPermutations(remainingPropertyNames.slice(1), currentPropertyValues);
    });
  }

  addPermutations(propertyNames, {});

  return result;
}
