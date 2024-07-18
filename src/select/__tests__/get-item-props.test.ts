// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { flattenOptions } from '../../internal/components/option/utils/flatten-options';
import { generateTestIndexes } from '../../internal/components/options-list/utils/test-indexes';
import { getItemProps } from '../utils/get-item-props';

const options = [
  {
    label: 'Group 1',
    options: [
      {
        label: 'Child 1',
      },
      {
        label: 'Child 2',
      },
    ],
  },
  {
    label: 'Option 1',
    labelTag: 'bx',
  },
  {
    label: 'Group 2',
    disabled: true,
    options: [
      {
        label: 'Child 1',
      },
      {
        label: 'Child 2',
        disabled: true,
      },
    ],
  },
];

const { flatOptions, parentMap } = flattenOptions(options);
generateTestIndexes(flatOptions, parentMap.get.bind(parentMap));

const isInteractive = (option: any) => !option.disabled && option.type !== 'parent';

const getOptionProps = (highlighted: boolean, selected: boolean) => (option: any, index: number) => {
  const optionProps: any = {
    key: index,
    option,
    highlighted,
    selected,
    ['data-mouse-target']: isInteractive(option) ? index : -1,
  };
  return optionProps;
};

const defaultItemProps = {
  option: flatOptions[1],
  index: 1,
  getOptionProps: getOptionProps(false, false),
  filteringValue: 'child',
  checkboxes: false,
};

describe('getItemProps', () => {
  test('should return props for the first child in the first group', () => {
    const props = getItemProps({ ...defaultItemProps });
    expect(props).toEqual({
      'data-child-index': 1,
      'data-group-index': 1,
      'data-test-index': 1,
      'data-mouse-target': 1,
      filteringValue: 'child',
      hasCheckbox: false,
      highlighted: false,
      key: 1,
      option: {
        option: { label: 'Child 1' },
        type: 'child',
      },
      selected: false,
    });
  });

  test('should return props for the first child in the first group with checkboxes and keyboard', () => {
    const props = getItemProps({
      ...defaultItemProps,
      checkboxes: true,
    });
    expect(props).toEqual({
      'data-child-index': 1,
      'data-group-index': 1,
      'data-test-index': 1,
      'data-mouse-target': 1,
      filteringValue: 'child',
      hasCheckbox: true,
      highlighted: false,
      key: 1,
      option: {
        option: { label: 'Child 1' },
        type: 'child',
      },
      selected: false,
    });
  });

  test('should return props for the first child in the first group with highlighted state', () => {
    const props = getItemProps({
      ...defaultItemProps,
      getOptionProps: getOptionProps(true, false),
    });
    expect(props).toEqual({
      'data-child-index': 1,
      'data-group-index': 1,
      'data-test-index': 1,
      'data-mouse-target': 1,
      filteringValue: 'child',
      hasCheckbox: false,
      highlighted: true,
      key: 1,
      option: {
        option: {
          label: 'Child 1',
        },
        type: 'child',
      },
      selected: false,
    });
  });

  test('should return props for the first child in the first group with selected state', () => {
    const props = getItemProps({
      ...defaultItemProps,
      getOptionProps: getOptionProps(false, true),
    });
    expect(props).toEqual({
      'data-child-index': 1,
      'data-group-index': 1,
      'data-test-index': 1,
      'data-mouse-target': 1,
      filteringValue: 'child',
      hasCheckbox: false,
      highlighted: false,
      key: 1,
      option: {
        option: {
          label: 'Child 1',
        },
        type: 'child',
      },
      selected: true,
    });
  });

  test('should return props for the option that is not in a group', () => {
    const props = getItemProps({
      ...defaultItemProps,
      option: flatOptions[3],
      index: 3,
    });
    expect(props).toEqual({
      'data-mouse-target': 3,
      'data-test-index': 3,
      filteringValue: 'child',
      hasCheckbox: false,
      highlighted: false,
      key: 3,
      option: {
        option: {
          label: 'Option 1',
          labelTag: 'bx',
        },
      },
      selected: false,
    });
  });
});
