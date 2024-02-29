// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { flattenOptions } from './flatten-options';
import { filterOptions } from './filter-options';
import { generateTestIndexes } from '../../options-list/utils/test-indexes';
import { SelectProps } from '../../../../select/interfaces';

export function prepareOptions(
  options: SelectProps.Options,
  filteringType: SelectProps.FilteringType,
  filteringText: string
) {
  const { flatOptions, parentMap } = flattenOptions(options);
  const filteredOptions = filteringType !== 'auto' ? flatOptions : filterOptions(flatOptions, filteringText);
  generateTestIndexes(filteredOptions);
  return {
    filteredOptions,
    parentMap,
    totalCount: flatOptions.length,
    matchesCount: filteredOptions.length,
  };
}
