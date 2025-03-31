// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { MultiselectProps } from '../interfaces';

export const optionsWithGroups: MultiselectProps.Options = [
  { label: 'First option', value: '1' },
  {
    label: 'First group',
    options: [
      {
        label: 'Second option',
        value: '2',
      },
      {
        label: 'Third option',
        value: '3',
      },
    ],
  },
  { label: 'Fourth option', value: '4' },
  {
    label: 'Second group',
    options: [
      {
        label: 'Fifth option',
        value: '5',
      },
      {
        label: 'Sixth option',
        value: '6',
      },
    ],
  },
];
