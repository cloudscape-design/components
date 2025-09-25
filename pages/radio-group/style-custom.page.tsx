// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { RadioGroup, SpaceBetween } from '~components';

import { palette } from '../app/themes/style-api';
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

  const style = {
    input: {
      stroke: {
        default: palette.neutral80,
        disabled: palette.neutral100,
        readOnly: palette.neutral90,
      },
      fill: {
        checked: palette.teal80,
        default: palette.neutral10,
        disabled: palette.neutral60,
        readOnly: palette.neutral40,
      },
      circle: {
        fill: {
          checked: palette.neutral10,
          disabled: palette.neutral10,
          readOnly: palette.neutral80,
        },
      },
      focusRing: {
        borderColor: palette.teal80,
        borderRadius: '2px',
        borderWidth: '1px',
      },
    },
    label: {
      color: {
        checked: `light-dark(${palette.neutral100}, ${palette.neutral10})`,
        default: `light-dark(${palette.neutral100}, ${palette.neutral10})`,
        disabled: `light-dark(${palette.neutral80}, ${palette.neutral40})`,
        readOnly: `light-dark(${palette.neutral80}, ${palette.neutral40})`,
      },
    },
    description: {
      color: {
        checked: `light-dark(${palette.neutral100}, ${palette.neutral10})`,
        default: `light-dark(${palette.neutral100}, ${palette.neutral10})`,
        disabled: `light-dark(${palette.neutral80}, ${palette.neutral40})`,
        readOnly: `light-dark(${palette.neutral80}, ${palette.neutral40})`,
      },
    },
  };

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
