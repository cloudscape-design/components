// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SelectProps } from '../../../lib/components/select';

export const VALUE_WITH_SPECIAL_CHARS = 'Option 4, test"2';

export const defaultOptions: SelectProps.Options = [
  { label: 'First', value: '1', testId: 'option-1-test-id' },
  { label: 'Second', value: '2', testId: 'option-2-test-id' },
  {
    label: 'Group',
    testId: 'group-test-id',
    options: [
      {
        label: 'Third',
        value: '3',
        lang: 'de',
        testId: 'option-3-test-id',
      },
      {
        label: 'Forth',
        value: VALUE_WITH_SPECIAL_CHARS,
        testId: 'option-4-test-id',
      },
    ],
  },
];

export const defaultProps = {
  options: defaultOptions,
  selectedOption: null,
  onChange: () => {},
};
