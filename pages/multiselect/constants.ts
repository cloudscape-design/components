// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MultiselectProps } from '~components/multiselect';

export const i18nStrings = {
  tokenLimitShowFewer: 'Show fewer chosen options',
  tokenLimitShowMore: 'Show more chosen options',
};

export const deselectAriaLabel = (option: MultiselectProps.Option) => {
  const label = option?.value || option?.label;
  return label ? `Deselect ${label}` : 'no label';
};

export const getInlineAriaLabel = (selectedOptions: MultiselectProps.Options) => {
  let label;

  if (selectedOptions.length === 0) {
    label = 0;
  }

  if (selectedOptions.length === 1) {
    label = selectedOptions[0].label;
  }

  if (selectedOptions.length === 2) {
    label = `${selectedOptions[0].label} and ${selectedOptions[1].label}`;
  }

  if (selectedOptions.length > 2) {
    label = `${selectedOptions[0].label}, ${selectedOptions[1].label}, and ${selectedOptions.length - 2} more`;
  }

  return label + ' selected';
};

export const optionGroupsShort = [
  {
    label: 'First category',
    options: [
      {
        value: 'option1',
        label: 'option1',
      },
      {
        value: 'option2',
        label: 'option2',
        description: 'option2',
        tags: ['2-CPU', '2Gb RAM', 'Stuff', 'More stuff', 'A lot'],
        disabled: true,
      },
      {
        value: 'option3',
        label: 'option3',
        description: 'option3',
        tags: ['2-CPU', '2Gb RAM'],
      },
    ],
  },
  {
    label: 'Second category',
    options: [
      {
        value: 'option4',
        label: 'option4',
        description: 'option4',
        tags: ['2-CPU', '2Gb RAM'],
      },
      {
        value: 'option5',
        label: 'option5',
        description: 'option5',
        tags: ['2-CPU', '2Gb RAM', 'Stuff', 'More stuff', 'A lot'],
        disabled: true,
      },
      {
        value: 'option6',
        label: 'option6',
        description: 'option6',
        tags: ['2-CPU', '2Gb RAM'],
      },
    ],
  },
];

export const optionGroupsLong = [
  ...optionGroupsShort,
  {
    label: 'Third category',
    options: [
      {
        value: 'option7',
        label: 'option7',
        description: 'option7',
        tags: ['2-CPU', '2Gb RAM'],
        disabled: true,
      },
      {
        value: 'option8',
        label: 'option8',
        description: 'option8',
        tags: ['2-CPU', '2Gb RAM', 'Stuff', 'More stuff', 'A lot'],
        disabled: true,
      },
      {
        value: 'option9',
        label: 'option9',
        description: 'option9',
        tags: ['2-CPU', '2Gb RAM'],
        disabled: true,
      },
    ],
  },
];
