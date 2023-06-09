// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export const createColorMode = (darkSelector: string) => ({
  id: 'color',
  states: {
    light: { default: true },
    dark: { selector: darkSelector, media: 'not print' },
  },
});

export const createDensityMode = (compactSelector: string) => ({
  id: 'density',
  states: {
    comfortable: { default: true },
    compact: { selector: compactSelector },
  },
});

export const createMotionMode = (disabledSelector: string) => ({
  id: 'motion',
  states: {
    default: { default: true },
    disabled: { selector: disabledSelector },
  },
});
