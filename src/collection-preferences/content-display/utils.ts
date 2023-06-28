// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '../interfaces';

export interface OptionWithVisibility extends CollectionPreferencesProps.ContentDisplayOption {
  visible?: boolean;
}

export function getSortedOptions({
  options,
  contentDisplay,
}: {
  options: ReadonlyArray<CollectionPreferencesProps.ContentDisplayOption>;
  contentDisplay: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>;
}): ReadonlyArray<OptionWithVisibility> {
  const optionsById: Record<string, CollectionPreferencesProps.ContentDisplayOption> = options.reduce(
    (currentValue, option) => ({ ...currentValue, [option.id]: option }),
    {}
  );
  return contentDisplay
    .map(({ id, visible }: CollectionPreferencesProps.ContentDisplayItem) => ({
      ...optionsById[id],
      visible,
    }))
    .filter(Boolean);
}
