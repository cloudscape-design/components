// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getTokenRootStyles } from '../styles';

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
          hover: '#dbeafe',
          disabled: '#f1f5f9',
          readOnly: '#f8fafc',
        },
        borderColor: {
          default: '#c7d2fe',
          hover: '#93c5fd',
          disabled: '#e2e8f0',
          readOnly: '#cbd5e1',
        },
        borderRadius: '24px',
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
