// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CollectionPreferencesProps } from '../interfaces';

type OptionOrGroup =
  | CollectionPreferencesProps.ContentDisplayOptionGroup
  | CollectionPreferencesProps.ContentDisplayOption;

export interface FlatOption extends CollectionPreferencesProps.ContentDisplayOption {
  visible: boolean;
  parent: null | string;
  group: boolean;
}

export function getProcessedOptions({
  options,
  contentDisplay,
  filterText,
}: {
  options: readonly OptionOrGroup[];
  contentDisplay: readonly CollectionPreferencesProps.ContentDisplayItem[];
  filterText: string;
}) {
  const optionDefinitions = new Map<string, OptionOrGroup>();
  for (const option of options) {
    optionDefinitions.set(option.id, option);
    'options' in option && option.options.forEach(option => optionDefinitions.set(option.id, option));
  }

  const optionsVisibility = new Set<string>();
  const optionsOrder = new Map<string, number>();
  for (const optionPreference of contentDisplay) {
    optionPreference.visible && optionsVisibility.add(optionPreference.id);
    optionsOrder.set(optionPreference.id, optionsOrder.size);
  }

  // Add options from content display preference even if those are not defined in preference settings.
  const undefinedOptions: OptionOrGroup[] = contentDisplay
    .filter(optionPreference => !optionDefinitions.has(optionPreference.id))
    .map(optionPreference => ({ ...optionPreference, label: optionPreference.id }));

  options = getFilteredOptions([...undefinedOptions, ...options], filterText);
  options = getSortedOptions([...undefinedOptions, ...options], optionsOrder);

  const processedOptions: FlatOption[] = [];
  for (const option of options) {
    const hasNested = 'options' in option;
    processedOptions.push({ ...option, visible: optionsVisibility.has(option.id), group: hasNested, parent: null });
    for (const child of hasNested ? option.options : []) {
      processedOptions.push({ ...child, visible: optionsVisibility.has(child.id), group: false, parent: option.id });
    }
  }

  return processedOptions;
}

function getFilteredOptions(options: readonly OptionOrGroup[], filterText: string): readonly OptionOrGroup[] {
  filterText = filterText.trim().toLowerCase();

  if (!filterText) {
    return options;
  }

  const matchOption = (option: OptionOrGroup) => option.label.toLowerCase().trim().includes(filterText);

  let filtered = options.map(option => {
    if ('options' in option) {
      return { ...option, options: option.options.filter(matchOption) };
    }
    return option;
  });

  filtered = filtered.filter(option => matchOption(option) || ('options' in option && option.options.length > 0));

  return filtered;
}

function getSortedOptions(options: readonly OptionOrGroup[], indices: Map<string, number>): readonly OptionOrGroup[] {
  const compare = (a: OptionOrGroup, b: OptionOrGroup) => (indices.get(a.id) ?? -1) - (indices.get(b.id) ?? -1);
  return options
    .map(option => {
      if ('options' in option) {
        return { ...option, options: [...option.options].sort(compare) };
      }
      return option;
    })
    .sort(compare);
}
