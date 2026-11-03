// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getTabContainerStyles, getTabStyles, getTabTriggerStyles, splitBlockValue } from '../styles';

// Mock the environment module
jest.mock('../../internal/environment', () => ({
  SYSTEM: 'core',
}));

const testStyles = {
  tab: {
    borderRadius: '4px',
    borderWidth: '2px',
    fontSize: '16px',
    fontWeight: '500',
    paddingBlock: '10px',
    paddingInline: '14px',
    backgroundColor: {
      default: '#dbeafe',
      active: '#bfdbfe',
      disabled: '#f3f4f6',
      hover: '#eff6ff',
    },
    borderColor: {
      default: '#3b82f6',
      active: '#1d4ed8',
      disabled: '#93c5fd',
      hover: '#2563eb',
    },
    color: {
      default: '#1e40af',
      active: '#1e3a8a',
      disabled: '#93c5fd',
      hover: '#1e40af',
    },
    focusRing: {
      borderColor: '#3b82f6',
      borderRadius: '4px',
      borderWidth: '2px',
    },
    activeIndicator: {
      color: '#1d4ed8',
      width: '3px',
      borderRadius: '2px',
    },
  },
  tabSeparator: {
    color: '#cbd5e1',
    width: '2px',
  },
  headerBorder: {
    color: '#94a3b8',
    width: '3px',
  },
};

describe('getTabStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('transforms tab styles to CSS properties', () => {
    expect(getTabStyles(testStyles)).toMatchSnapshot();
    expect(getTabContainerStyles(testStyles)).toMatchSnapshot();
    expect(getTabTriggerStyles(testStyles)).toMatchSnapshot();
  });

  test('returns undefined when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const {
      getTabStyles: getTabStylesNonCore,
      getTabContainerStyles: getTabContainerStylesNonCore,
      getTabTriggerStyles: getTabTriggerStylesNonCore,
    } = await import('../styles');

    expect(getTabStylesNonCore(testStyles)).toBeUndefined();
    expect(getTabContainerStylesNonCore(testStyles)).toBeUndefined();
    expect(getTabTriggerStylesNonCore(testStyles)).toBeUndefined();
  });
});

describe('splitBlockValue', () => {
  test('uses one value for both sides', () => {
    expect(splitBlockValue('4px')).toEqual(['4px', '4px']);
  });

  test('splits two values into start and end', () => {
    expect(splitBlockValue('4px 8px')).toEqual(['4px', '8px']);
  });

  test('keeps function values intact', () => {
    expect(splitBlockValue('calc(1rem - 1px) var(--gap, 2px)')).toEqual(['calc(1rem - 1px)', 'var(--gap, 2px)']);
  });

  test('returns undefined for no value', () => {
    expect(splitBlockValue(undefined)).toEqual([undefined, undefined]);
    expect(splitBlockValue('')).toEqual([undefined, undefined]);
  });
});
