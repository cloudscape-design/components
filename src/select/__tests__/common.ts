// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SelectProps } from '../../../lib/components/select';

export const VALUE_WITH_SPECIAL_CHARS = 'Option 4, test"2';

export const defaultOptions: SelectProps.Options = [
  { label: 'First', value: '1' },
  { label: 'Second', value: '2' },
  {
    label: 'Group',
    options: [
      {
        label: 'Third',
        value: '3',
        lang: 'de',
      },
      {
        label: 'Forth',
        value: VALUE_WITH_SPECIAL_CHARS,
      },
    ],
  },
];

export const defaultProps = {
  options: defaultOptions,
  selectedOption: null,
  onChange: () => {},
};
