// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Select from '~components/select';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';
import FocusTarget from '../common/focus-target';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

export default function SelectValidationFocusPage() {
  return (
    <SimplePage title="Select validation focus" screenshotArea={{ disableAnimations: true }} settings={<FocusTarget />}>
      <SpaceBetween size="m">
        <Select
          data-testid="select-invalid"
          ariaLabel="select invalid"
          invalid={true}
          options={options}
          selectedOption={null}
          placeholder="Choose an option"
          onChange={() => {}}
        />
        <Select
          data-testid="select-warning"
          ariaLabel="select warning"
          warning={true}
          options={options}
          selectedOption={null}
          placeholder="Choose an option"
          onChange={() => {}}
        />
      </SpaceBetween>
    </SimplePage>
  );
}
