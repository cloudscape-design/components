// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Checkbox, SpaceBetween } from '~components';

import { palette } from '../app/themes/style-api';
import ScreenshotArea from '../utils/screenshot-area';

export default function CustomCheckbox() {
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
      color: {
        checked: `light-dark(${palette.neutral100}, ${palette.neutral10})`,
        default: `light-dark(${palette.neutral100}, ${palette.neutral10})`,
        disabled: `light-dark(${palette.neutral60}, ${palette.neutral40})`,
        indeterminate: `light-dark(${palette.neutral100}, ${palette.neutral10})`,
        readOnly: `light-dark(${palette.neutral80}, ${palette.neutral40})`,
      },
    },
  };

  return (
    <ScreenshotArea>
      <h1>Custom Checkbox</h1>

      <SpaceBetween size="m" direction="vertical">
        <SpaceBetween size="m" direction="horizontal">
          <Checkbox checked={false} style={style} data-testid="1">
            Custom 1
          </Checkbox>

          <Checkbox checked={false} disabled={true} style={style}>
            Custom 2
          </Checkbox>

          <Checkbox checked={false} disabled={false} readOnly={true} style={style}>
            Custom 3
          </Checkbox>
        </SpaceBetween>

        <SpaceBetween size="m" direction="horizontal">
          <Checkbox checked={true} style={style} data-testid="4">
            Custom 4
          </Checkbox>

          <Checkbox checked={true} disabled={true} readOnly={false} style={style}>
            Custom 5
          </Checkbox>

          <Checkbox checked={true} disabled={false} readOnly={true} style={style}>
            Custom 6
          </Checkbox>
        </SpaceBetween>

        <SpaceBetween size="m" direction="horizontal">
          <Checkbox checked={true} indeterminate={true} style={style}>
            Custom 7
          </Checkbox>

          <Checkbox checked={true} indeterminate={true} disabled={true} readOnly={false} style={style}>
            Custom 8
          </Checkbox>

          <Checkbox checked={true} indeterminate={true} disabled={false} readOnly={true} style={style}>
            Custom 9
          </Checkbox>
        </SpaceBetween>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
