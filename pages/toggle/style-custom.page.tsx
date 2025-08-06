// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { SpaceBetween, Toggle } from '~components';

import { palette } from '../app/themes/style-api';
import ScreenshotArea from '../utils/screenshot-area';

export default function CustomToggle() {
  const style = {
    root: {
      background: {
        checked: palette.teal80,
        default: palette.teal80,
        disabled: palette.teal40,
        readOnly: palette.teal40,
      },
      focusRing: {
        borderColor: palette.teal80,
        borderRadius: '4px',
        borderWidth: '3px',
      },
    },
    handle: {
      background: {
        checked: palette.neutral10,
        default: palette.neutral10,
        disabled: palette.neutral10,
        readOnly: palette.neutral80,
      },
    },
    label: {
      color: {
        checked: palette.neutral100,
        default: palette.neutral100,
        disabled: palette.neutral90,
        readOnly: palette.neutral100,
      },
    },
  };

  return (
    <ScreenshotArea>
      <h1>Custom Toggle</h1>

      <SpaceBetween size="m" direction="vertical">
        <SpaceBetween size="m" direction="horizontal">
          <Toggle checked={false} style={style}>
            Toggle
          </Toggle>

          <Toggle checked={false} disabled={true} readOnly={false} style={style}>
            Toggle
          </Toggle>

          <Toggle checked={false} disabled={false} readOnly={true} style={style}>
            Toggle
          </Toggle>
        </SpaceBetween>

        <SpaceBetween size="m" direction="horizontal">
          <Toggle checked={true} style={style}>
            Toggle
          </Toggle>

          <Toggle checked={true} disabled={true} readOnly={false} style={style}>
            Toggle
          </Toggle>

          <Toggle checked={true} disabled={false} readOnly={true} style={style}>
            Toggle
          </Toggle>
        </SpaceBetween>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
