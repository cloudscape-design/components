// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SelectProps } from '../../../../select/interfaces';
import { generateTestIndexes } from '../../options-list/utils/test-indexes';
import { filterOptions } from './filter-options';
import { flattenOptions } from './flatten-options';

export function prepareOptions(
  options: SelectProps.Options,
  filteringType: SelectProps.FilteringType,
  filteringText: string
) {
  const { flatOptions, parentMap } = flattenOptions(options);
  const filteredOptions = filteringType !== 'auto' ? flatOptions : filterOptions(flatOptions, filteringText);
  generateTestIndexes(filteredOptions, parentMap.get.bind(parentMap));
  return {
    filteredOptions,
    parentMap,
    totalCount: flatOptions.length,
    matchesCount: filteredOptions.length,
  };
}
