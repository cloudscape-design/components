// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Creates a color mode with two states:
 * - `light` (default)
 * - `dark`  — activated by `darkSelector` class (e.g. `.awsui-dark-mode`)
 *
 * The CSS-only auto-mode (`.awsui-auto-mode`) is handled separately at the
 * stylesheet level in `src/internal/base-component/styles.scss` rather than
 * here, because it requires wrapping the same token overrides in an additional
 * `@media (prefers-color-scheme: dark)` query — a transformation the
 * theming-build pipeline does not currently support as a third mode state.
 */
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
