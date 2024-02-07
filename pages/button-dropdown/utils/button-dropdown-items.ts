// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const dropdownItems = [
  {
    id: 'category2',
    text: 'disabled category',
    disabled: true,
    items: [{ id: 'id5', text: 'option3' }],
  },
  {
    id: 'id7',
    text: 'option5',
    disabled: true,
  },
  {
    id: 'id8',
    text: 'VeryLongOptionTextValueHereToTestTheCaseWithThisDropdown',
  },
  { id: 'id9', text: 'option6' },
];
const expandableGroup = {
  id: 'category1',
  text: 'category1longext',
  items: [
    { id: 'id1', text: 'VeryLongOptionTextValueHereToTestTheCaseWithThisDropdown' },
    { id: 'id2', text: 'option1', disabled: true },
    { id: 'id3', text: 'option2' },
    { id: 'id4', text: 'VeryLongOptionTextValueHereToTestTheCaseWithThisDropdown', disabled: true },
  ],
};

const nestedExpandableGroup = {
  ...expandableGroup,
  items: [
    ...expandableGroup.items,
    {
      id: 'id4',
      text: 'option4',
      items: [
        { id: 'id5', text: 'Nested item' },
        { id: 'id6', text: 'Deeply expandable group', items: [{ id: 'id6', text: 'Deeply nested item' }] },
      ],
    },
  ],
};

export default [expandableGroup, ...dropdownItems];

export const largeGroupItems = [
  {
    id: 'category1',
    text: 'category1longext',
    items: [...Array(50)].map((_, index) => ({
      id: 'subitem' + index,
      text: 'Sub item ' + index,
    })),
  },
  ...dropdownItems,
];

export const nestedExpandableGroupItems = [nestedExpandableGroup, ...dropdownItems];
