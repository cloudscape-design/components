// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from './interfaces';

export function getSortedOptions({
  options,
  order,
}: {
  options: ReadonlyArray<CollectionPreferencesProps.VisibleContentOption>;
  order: ReadonlyArray<string>;
}) {
  const optionsSet: Record<string, CollectionPreferencesProps.VisibleContentOption> = options.reduce(
    (currentValue, option) => ({ ...currentValue, [option.id]: option }),
    {}
  );
  return order.map(id => optionsSet[id]).filter(Boolean);
}

export function reorderOptions({
  draggedOptionId,
  verticalCenters,
  dragAmount,
}: {
  draggedOptionId: string;
  verticalCenters: Record<string, number>;
  dragAmount: number;
}) {
  const centersArray = [];
  for (const id of Object.keys(verticalCenters)) {
    const center = id === draggedOptionId ? verticalCenters[id] + dragAmount : verticalCenters[id];
    centersArray.push({ id, center });
  }
  const sortedCenters = [...centersArray].sort((center1, center2) => center1.center - center2.center);
  return sortedCenters.map(({ id }) => id);
}
