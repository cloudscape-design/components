// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '~components/form-field';
import Input from '~components/input';

// SPDX-License-Identifier: Apache-2.0
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
