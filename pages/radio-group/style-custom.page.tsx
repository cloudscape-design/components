// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { RadioGroup, SpaceBetween } from '~components';

import customStyle from '../radio-button/custom-style';
import ScreenshotArea from '../utils/screenshot-area';

export default function CustomRadio() {
  const items = [
    {
      value: 'first',
      label: 'First choice',
      description: 'This is the first option.',
    },
    {
      disabled: true,
      value: 'second',
      label: 'Second choice',
      description: 'This is the second option.',
    },
    {
      value: 'third',
      label: 'Third choice',
      description: 'This is the third option.',
    },
  ];

  return (
    <ScreenshotArea>
      <h1>Custom Radio</h1>

      <SpaceBetween size="m" direction="vertical">
        <SpaceBetween size="m" direction="horizontal">
          <RadioGroup value="first" items={items} style={customStyle} data-testid="1" />
          <RadioGroup value="second" items={items} style={customStyle} />
          <RadioGroup value="third" items={items} style={customStyle} readOnly={true} />
        </SpaceBetween>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
