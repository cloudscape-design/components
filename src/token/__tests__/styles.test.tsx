// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getDismissButtonStyles, getTokenRootStyles } from '../styles';

jest.mock('../../internal/environment', () => ({
  SYSTEM: 'core',
}));

describe('getTokenRootStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles undefined and empty style', () => {
    expect(getTokenRootStyles(undefined)).toEqual({});
    expect(getTokenRootStyles({})).toEqual({});
  });

  test('handles all possible style configurations', () => {
    const allStyles = {
      root: {
        background: {
          default: '#eef2ff',
          disabled: '#f1f5f9',
          readOnly: '#f8fafc',
        },
        borderColor: {
          default: '#c7d2fe',
          disabled: '#e2e8f0',
          readOnly: '#cbd5e1',
        },
        borderRadius: '24px',
        borderWidth: '2px',
        paddingBlock: '4px',
        paddingInline: '12px',
      },
      dismissButton: {
        color: {
          default: '#6366f1',
          hover: '#4338ca',
          disabled: '#cbd5e1',
          readOnly: '#94a3b8',
        },
        focusRing: {
          borderColor: '#6366f1',
          borderRadius: '12px',
          borderWidth: '2px',
        },
      },
    };

    expect(getTokenRootStyles(allStyles)).toMatchSnapshot();
  });

  test('returns empty object when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getTokenRootStyles: fn } = await import('../styles');
    expect(fn({ root: { background: { default: '#fff' } } })).toMatchSnapshot();
  });
});

describe('getDismissButtonStyles', () => {
  const dismissButton = {
    color: { default: 'default', hover: 'hover', disabled: 'disabled', readOnly: 'readOnly' },
    focusRing: { borderColor: 'ring', borderRadius: '4px', borderWidth: '2px' },
  };

  test('maps the token dismiss button style to the button style', () => {
    expect(getDismissButtonStyles({ dismissButton }, {})).toEqual({
      root: {
        color: { default: 'default', hover: 'hover', active: 'hover', disabled: 'disabled' },
        focusRing: dismissButton.focusRing,
      },
    });
  });

  test('uses the read-only color for the disabled state of a read-only token', () => {
    expect(getDismissButtonStyles({ dismissButton }, { readOnly: true })!.root!.color!.disabled).toBe('readOnly');
  });

  test('uses the disabled color when a token is both disabled and read-only', () => {
    const styles = getDismissButtonStyles({ dismissButton }, { disabled: true, readOnly: true });
    expect(styles!.root!.color!.disabled).toBe('disabled');
  });

  test('returns undefined without a dismiss button style', () => {
    expect(getDismissButtonStyles({ root: {} }, {})).toBeUndefined();
  });
});
