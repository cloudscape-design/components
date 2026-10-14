// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

function Section({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <SpaceBetween size="xxs">
      <Box variant="small">{caption}</Box>
      {children}
    </SpaceBetween>
  );
}

export default function SelectValidationFocusPage() {
  return (
    <SimplePage title="Standalone Select validation focus" screenshotArea={{ disableAnimations: true }}>
      {/* Focus button is first in tab order: a test clicks it, then presses Tab to move
          keyboard focus (focus-visible) onto the invalid Select trigger below. */}
      <button id="focus-button">Focus below</button>
      <Section caption="Select invalid">
        <Select
          data-testid="select-invalid"
          ariaLabel="select invalid"
          invalid={true}
          options={options}
          selectedOption={null}
          placeholder="Choose an option"
          onChange={() => {}}
        />
      </Section>
      <Section caption="Select warning">
        <Select
          data-testid="select-warning"
          ariaLabel="select warning"
          warning={true}
          options={options}
          selectedOption={null}
          placeholder="Choose an option"
          onChange={() => {}}
        />
      </Section>
    </SimplePage>
  );
}
