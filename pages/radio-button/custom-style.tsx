// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { palette } from '../app/themes/style-api';

export default {
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
