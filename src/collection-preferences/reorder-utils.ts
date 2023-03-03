// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from './interfaces';

type Order = ReadonlyArray<string>;

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

export function areOrdersEqual(order1: Order, order2: Order) {
  if (order1.length !== order2.length) {
    return false;
  }
  for (let i = 0; i < order1.length; i++) {
    if (order1[i] !== order2[i]) {
      return false;
    }
  }
  return true;
}

export function getFlatOptionIds(options: ReadonlyArray<CollectionPreferencesProps.VisibleContentOptionsGroup>) {
  return options.reduce<string[]>(
    (ids, group) => [...ids, ...group.options.reduce<string[]>((groupIds, option) => [...groupIds, option.id], [])],
    []
  );
}
