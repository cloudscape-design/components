// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { SpaceBetween, Toggle } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

export default function CustomToggle() {
  const style = {
    root: {
      background: {
        checked: 'brown',
        default: 'green',
        disabled: 'blue',
        readOnly: 'orange',
      },
      focusRing: {
        borderColor: 'magenta',
        borderRadius: '0px',
        borderWidth: '3px',
      },
    },
    handle: {
      background: {
        checked: 'yellow',
        default: 'green',
        disabled: 'magenta',
        readOnly: 'brown',
      },
    },
    label: {
      color: {
        checked: 'orange',
        default: 'green',
        disabled: 'blue',
        readOnly: 'red',
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
