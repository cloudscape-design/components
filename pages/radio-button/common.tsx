// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '~components/form-field';
import Input from '~components/input';
import { RadioButtonProps } from '~components/radio-button';

import createPermutations from '../utils/permutations';

export const options = [
  { value: 'email', label: 'E-Mail', description: 'First option' },
  { value: 'phone', label: 'Telephone', description: 'Second option', allowDisabled: true, allowReadOnly: true },
  { value: 'mail', label: 'Postal mail', description: 'Third option' },
];

export const ExtraOptions = () => {
  const [value, setValue] = useState('');
  return (
    <FormField label="Address">
      <Input value={value} onChange={({ detail }) => setValue(detail.value)} placeholder="Enter your address" />
    </FormField>
  );
};

export const shortText = 'Short text';

export const longText =
  'Long text, long enough to wrap.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Whatever.';

export const permutations = createPermutations<Omit<RadioButtonProps, 'name'>>([
  {
    description: [undefined, shortText, longText],
    children: [undefined, shortText, longText],
    readOnly: [false, true],
    disabled: [false, true],
    checked: [true, false],
  },
]);
