// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import FormField from '~components/form-field';
import Input from '~components/input';

const maxCharacterCount = 20;

export default function FormFieldCharacterCountPage() {
  const [value, setValue] = useState('');

  return (
    <>
      <h1>Form field character count debouncing</h1>
      <FormField
        label="Name"
        constraintText="Name must be 1 to 10 characters."
        characterCountText={`Character count: ${value.length}/${maxCharacterCount}`}
        errorText={value.length > maxCharacterCount && 'The name has too many characters.'}
      >
        <Input value={value} onChange={event => setValue(event.detail.value)} />
      </FormField>
    </>
  );
}
