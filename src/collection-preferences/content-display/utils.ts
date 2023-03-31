// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '../interfaces';

export function getSortedOptions({
  options,
  order,
}: {
  options: ReadonlyArray<CollectionPreferencesProps.ContentDisplayOption>;
  order: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>;
}) {
  const optionsSet: Record<string, CollectionPreferencesProps.VisibleContentOption> = options.reduce(
    (currentValue, option) => ({ ...currentValue, [option.id]: option }),
    {}
  );
  return order.map(({ id }) => optionsSet[id]).filter(Boolean);
}
