// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { RadioGroup, SpaceBetween } from '~components';

import useCustomStyle from '../radio-button/use-custom-style';
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

  const style = useCustomStyle();

  return (
    <ScreenshotArea>
      <h1>Custom Radio</h1>

      <SpaceBetween size="m" direction="vertical">
        <SpaceBetween size="m" direction="horizontal">
          <RadioGroup value="first" items={items} style={style} data-testid="1" />
          <RadioGroup value="second" items={items} style={style} />
          <RadioGroup value="third" items={items} style={style} readOnly={true} />
        </SpaceBetween>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
