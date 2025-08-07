// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';

import { Checkbox, SpaceBetween } from '~components';

import { palette } from '../app/themes/style-api';
import ScreenshotArea from '../utils/screenshot-area';

export default function CustomCheckbox() {
  const mode = useCurrentMode(useRef(document.body));

  const colors = {
    light: {
      checked: palette.neutral100,
      default: palette.neutral100,
      disabled: palette.neutral60,
      indeterminate: palette.neutral100,
      readOnly: palette.neutral80,
    },
    dark: {
      checked: palette.neutral10,
      default: palette.neutral10,
      disabled: palette.neutral40,
      indeterminate: palette.neutral10,
      readOnly: palette.neutral40,
    },
  };

  const style = {
    input: {
      fill: {
        checked: palette.teal80,
        default: palette.neutral10,
        disabled: palette.neutral40,
        indeterminate: palette.teal80,
        readOnly: palette.neutral40,
      },
      stroke: {
        checked: palette.teal80,
        default: palette.neutral80,
        disabled: palette.neutral40,
        indeterminate: palette.teal80,
        readOnly: palette.neutral40,
      },
      check: {
        stroke: {
          checked: palette.teal10,
          disabled: palette.neutral10,
          indeterminate: palette.teal10,
          readOnly: palette.neutral80,
        },
      },
      focusRing: {
        borderColor: palette.teal80,
        borderRadius: '0px',
        borderWidth: '3px',
      },
    },
    label: {
      color: { ...colors[mode] },
    },
  };

  return (
    <ScreenshotArea>
      <h1>Custom Checkbox</h1>

      <SpaceBetween size="m" direction="vertical">
        <SpaceBetween size="m" direction="horizontal">
          <Checkbox checked={false} style={style}>
            Expire 1
          </Checkbox>

          <Checkbox checked={false} disabled={true} style={style}>
            Expire 2
          </Checkbox>

          <Checkbox checked={false} disabled={false} readOnly={true} style={style}>
            Expire 3
          </Checkbox>
        </SpaceBetween>

        <SpaceBetween size="m" direction="horizontal">
          <Checkbox checked={true} style={style}>
            Expire 4
          </Checkbox>

          <Checkbox checked={true} disabled={true} readOnly={false} style={style}>
            Expire 5
          </Checkbox>

          <Checkbox checked={true} disabled={false} readOnly={true} style={style}>
            Expire 6
          </Checkbox>
        </SpaceBetween>

        <SpaceBetween size="m" direction="horizontal">
          <Checkbox checked={true} indeterminate={true} style={style}>
            Expire 7
          </Checkbox>

          <Checkbox checked={true} indeterminate={true} disabled={true} readOnly={false} style={style}>
            Expire 8
          </Checkbox>

          <Checkbox checked={true} indeterminate={true} disabled={false} readOnly={true} style={style}>
            Expire 9
          </Checkbox>
        </SpaceBetween>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
