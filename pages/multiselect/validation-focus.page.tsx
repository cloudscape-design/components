// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Multiselect from '~components/multiselect';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';
import FocusTarget from '../common/focus-target';

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

export default function MultiselectValidationFocusPage() {
  return (
    <SimplePage title="Standalone Multiselect validation focus" screenshotArea={{ disableAnimations: true }}>
      <FocusTarget />
      <Section caption="Multiselect invalid">
        <Multiselect
          data-testid="multiselect-invalid"
          ariaLabel="multiselect invalid"
          invalid={true}
          options={options}
          selectedOptions={[]}
          placeholder="Choose options"
          onChange={() => {}}
        />
      </Section>
      <Section caption="Multiselect warning">
        <Multiselect
          data-testid="multiselect-warning"
          ariaLabel="multiselect warning"
          warning={true}
          options={options}
          selectedOptions={[]}
          placeholder="Choose options"
          onChange={() => {}}
        />
      </Section>
    </SimplePage>
  );
}
