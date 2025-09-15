// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef } from 'react';

import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';

import { palette } from '../app/themes/style-api';

const colors = {
  light: {
    checked: palette.neutral100,
    default: palette.neutral100,
    disabled: palette.neutral80,
    readOnly: palette.neutral80,
  },
  dark: {
    checked: palette.neutral10,
    default: palette.neutral10,
    disabled: palette.neutral40,
    readOnly: palette.neutral40,
  },
};

const getCustomStyle = (mode: 'dark' | 'light') => ({
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
    color: { ...colors[mode] },
  },
  description: {
    color: { ...colors[mode] },
  },
});

const useCustomStyle = () => {
  const mode = useCurrentMode(useRef(document.body));
  return getCustomStyle(mode);
};

export default useCustomStyle;
