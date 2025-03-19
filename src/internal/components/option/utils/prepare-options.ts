// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SelectProps } from '../../../../select/interfaces';
import { generateTestIndexes } from '../../options-list/utils/test-indexes';
import { DropdownOption } from '../interfaces';
import { filterOptions } from './filter-options';
import { flattenOptions } from './flatten-options';

export function prepareOptions(
  options: SelectProps.Options,
  filteringType: SelectProps.FilteringType,
  filteringText: string,
  extraOptions?: ReadonlyArray<DropdownOption>
) {
  const { flatOptions, parentMap } = flattenOptions(options);
  const filteredOptions = filteringType !== 'auto' ? flatOptions : filterOptions(flatOptions, filteringText);
  const allOptions = extraOptions ? [...extraOptions, ...flatOptions] : flatOptions;
  const allFilteredOptions = extraOptions ? [...extraOptions, ...filteredOptions] : filteredOptions;
  generateTestIndexes(allFilteredOptions, parentMap.get.bind(parentMap));
  return {
    allOptions,
    filteredOptions: allFilteredOptions,
    parentMap,
    totalCount: flatOptions.length,
    matchesCount: filteredOptions.length,
  };
}
