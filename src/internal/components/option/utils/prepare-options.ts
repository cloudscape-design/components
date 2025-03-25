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
  // Options that are injected by the component, such as "select all".
  // Not defined by the customer as an option but we treat it as such
  // e.g, regarding keyboard navigation and accessibility.
  metaOptions?: ReadonlyArray<DropdownOption>
) {
  const { flatOptions, parentMap } = flattenOptions(options);
  const filteredOptions = filteringType !== 'auto' ? flatOptions : filterOptions(flatOptions, filteringText);
  const allOptions = metaOptions ? [...metaOptions, ...flatOptions] : flatOptions;
  const visibleOptions = metaOptions ? [...metaOptions, ...filteredOptions] : filteredOptions;
  generateTestIndexes(visibleOptions, parentMap.get.bind(parentMap));
  return {
    allOptions,
    filteredOptions,
    visibleOptions,
    parentMap,
    totalCount: flatOptions.length,
    matchesCount: filteredOptions.length,
  };
}
