// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DropdownOption } from '../../internal/components/option/interfaces';
import { getTestOptionIndexes } from '../../internal/components/options-list/utils/test-indexes';

interface ItemProps {
  option: DropdownOption;
  index: number;
  getOptionProps: any;
  filteringValue: string;
  isKeyboard: boolean;
  checkboxes: boolean;
}

export const getItemProps = ({
  option,
  index,
  getOptionProps,
  filteringValue,
  isKeyboard = false,
  checkboxes = false,
}: ItemProps) => {
  const optionProps = getOptionProps(option, index);
  optionProps.filteringValue = filteringValue;
  const { inGroupIndex, groupIndex, throughIndex } = getTestOptionIndexes(option) || {};
  return {
    ...optionProps,
    isKeyboard,
    hasCheckbox: checkboxes,
    ['data-group-index']: groupIndex,
    ['data-child-index']: inGroupIndex,
    ['data-test-index']: throughIndex,
  };
};
