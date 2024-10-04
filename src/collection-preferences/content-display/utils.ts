// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '../interfaces';

export interface OptionWithVisibility extends CollectionPreferencesProps.ContentDisplayOption {
  visible: boolean;
}

export function getSortedOptions({
  options,
  contentDisplay,
}: {
  options: ReadonlyArray<CollectionPreferencesProps.ContentDisplayOption>;
  contentDisplay: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>;
}): ReadonlyArray<OptionWithVisibility> {
  // By using a Map, we are guaranteed to preserve insertion order on future iteration.
  const optionsById = new Map<string, OptionWithVisibility>();
  // We insert contentDisplay first so we respect the currently selected order
  for (const { id, visible } of contentDisplay) {
    // If an option is provided in contentDisplay and not options, we default the label to the id
    optionsById.set(id, { id, label: id, visible });
  }
  // We merge options data, and insert any that were not in contentDisplay as non-visible
  for (const option of options) {
    const existing = optionsById.get(option.id);
    optionsById.set(option.id, { ...option, visible: !!existing?.visible });
  }
  return Array.from(optionsById.values());
}
