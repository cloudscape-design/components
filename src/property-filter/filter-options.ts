// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AutosuggestProps } from '../autosuggest/interfaces';
import { OptionDefinition } from '../internal/components/option/interfaces';

export function filterOptions(
  options: readonly (AutosuggestProps.Option | AutosuggestProps.OptionGroup)[],
  searchText = ''
): readonly (AutosuggestProps.Option | AutosuggestProps.OptionGroup)[] {
  if (!searchText) {
    return options;
  }

  const filtered: (AutosuggestProps.Option | AutosuggestProps.OptionGroup)[] = [];
  for (const option of options) {
    if (isGroup(option)) {
      const childOptions = filterOptions(option.options, searchText);
      if (childOptions.length > 0) {
        filtered.push({ ...option, options: childOptions });
      }
    } else if (matchSingleOption(option, searchText)) {
      filtered.push(option);
    }
  }
  return filtered;
}

function isGroup(optionOrGroup: AutosuggestProps.Option): optionOrGroup is AutosuggestProps.OptionGroup {
  return 'options' in optionOrGroup;
}

function matchSingleOption(option: OptionDefinition, searchText: string): boolean {
  return (option.label ?? '').toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
}
