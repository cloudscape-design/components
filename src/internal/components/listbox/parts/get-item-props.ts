// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DropdownOption } from '../../option/interfaces';
import { getTestOptionIndexes } from '../../options-list/utils/test-indexes';

interface ItemProps {
  option: DropdownOption;
  index: number;
  getOptionProps: any;
  filteringValue: string;
}

export const getItemProps = ({ option, index, getOptionProps, filteringValue }: ItemProps) => {
  const optionProps = getOptionProps(option, index);
  optionProps.filteringValue = filteringValue;
  const { inGroupIndex, groupIndex, throughIndex } = getTestOptionIndexes(option) || {};
  return {
    ...optionProps,
    ['data-group-index']: groupIndex,
    ['data-child-index']: inGroupIndex,
    ['data-test-index']: throughIndex,
  };
};
