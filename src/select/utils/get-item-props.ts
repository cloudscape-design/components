// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DropdownOption } from '../../internal/components/option/interfaces';
import { getTestOptionIndexes } from '../../internal/components/options-list/utils/test-indexes';

interface ItemProps {
  option: DropdownOption;
  index: number;
  getOptionProps: any;
  filteringValue: string;
  checkboxes: boolean;
}

export const getItemProps = ({ option, index, getOptionProps, filteringValue, checkboxes = false }: ItemProps) => {
  const optionProps = getOptionProps(option, index);
  optionProps.filteringValue = filteringValue;
  const { inGroupIndex, groupIndex, throughIndex } = getTestOptionIndexes(option) || {};
  return {
    ...optionProps,
    hasCheckbox: checkboxes,
    ['data-group-index']: groupIndex,
    ['data-child-index']: inGroupIndex,
    ['data-test-index']: throughIndex,
  };
};
