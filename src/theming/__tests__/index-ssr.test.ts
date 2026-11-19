/**
 * @jest-environment node
 */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { applyGlobalTheme, setGlobalTheme, Theme } from '../../../lib/components/theming';

const theme: Theme = {
  tokens: {
    colorTextAccent: {
      light: 'red',
      dark: 'orange',
    },
  },
};

test('window is not defined in this environment', () => {
  expect(typeof window).toBe('undefined');
});

describe('setGlobalTheme', () => {
  test('does not throw when window is undefined', () => {
    expect(() => setGlobalTheme(theme)).not.toThrow();
  });
});

describe('applyGlobalTheme', () => {
  test('does not throw when window is undefined', () => {
    expect(() => applyGlobalTheme()).not.toThrow();
  });

  test('returns a no-op reset function when window is undefined', () => {
    const { reset } = applyGlobalTheme();
    expect(reset).toBeInstanceOf(Function);
    expect(() => reset()).not.toThrow();
  });
});
