// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Input from '~components/input';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

function Section({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <SpaceBetween size="xxs">
      <Box variant="small">{caption}</Box>
      {children}
    </SpaceBetween>
  );
}

export default function InputFocusStatesPage() {
  return (
    <SimplePage title="Input focus states" screenshotArea={{ disableAnimations: true }}>
      <Section caption="readonly">
        <Input data-testid="readonly" ariaLabel="readonly" readOnly={true} value="Read-only value" />
      </Section>
      <Section caption="native-invalid">
        <Input
          data-testid="native-invalid"
          ariaLabel="native-invalid"
          type="email"
          value="not-an-email"
          onChange={() => {}}
        />
      </Section>
      <Section caption="suffix">
        <Input data-testid="suffix" ariaLabel="suffix" value="42" suffix="USD" onChange={() => {}} />
      </Section>
      <Section caption="prefix">
        <Input data-testid="prefix" ariaLabel="prefix" value="42" prefix="$" onChange={() => {}} />
      </Section>
    </SimplePage>
  );
}
