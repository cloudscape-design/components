// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import customCssProps from '../../internal/generated/custom-css-properties';
import { getTabContainerStyles, getTabHeaderStyles, getTabStyles } from '../styles';

// Mock the environment module
jest.mock('../../internal/environment', () => ({
  SYSTEM: 'core',
}));

describe('getTabStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles tab style configurations', () => {
    expect(getTabStyles(undefined)).toBeUndefined();
    expect(getTabStyles({})).toBeUndefined();

    const tabStyles = {
      tabs: {
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
      },
    };

    expect(getTabStyles(tabStyles)).toEqual({
      borderRadius: '4px',
      borderWidth: '2px',
      fontSize: '16px',
      fontWeight: '500',
      paddingBlock: '10px',
      paddingInline: '14px',
      [customCssProps.styleBackgroundActive]: '#bfdbfe',
      [customCssProps.styleBackgroundDefault]: '#dbeafe',
      [customCssProps.styleBackgroundDisabled]: '#f3f4f6',
      [customCssProps.styleBackgroundHover]: '#eff6ff',
      [customCssProps.styleBorderColorActive]: '#1d4ed8',
      [customCssProps.styleBorderColorDefault]: '#3b82f6',
      [customCssProps.styleBorderColorDisabled]: '#93c5fd',
      [customCssProps.styleBorderColorHover]: '#2563eb',
      [customCssProps.styleColorActive]: '#1e3a8a',
      [customCssProps.styleColorDefault]: '#1e40af',
      [customCssProps.styleColorDisabled]: '#93c5fd',
      [customCssProps.styleColorHover]: '#1e40af',
      [customCssProps.styleFocusRingBorderColor]: '#3b82f6',
      [customCssProps.styleFocusRingBorderRadius]: '4px',
      [customCssProps.styleFocusRingBorderWidth]: '2px',
    });
  });

  test('returns undefined when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getTabStyles: getTabStylesNonCore } = await import('../styles');

    const style = {
      tabs: {
        borderRadius: '4px',
      },
    };

    const result = getTabStylesNonCore(style);

    expect(result).toBeUndefined();
  });
});

describe('getTabContainerStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles tab container style configurations', () => {
    expect(getTabContainerStyles(undefined)).toBeUndefined();
    expect(getTabContainerStyles({})).toBeUndefined();

    const containerStyles = {
      underline: {
        color: '#1d4ed8',
        width: '3px',
        borderRadius: '2px',
      },
      divider: {
        color: '#cbd5e1',
        width: '2px',
      },
    };

    expect(getTabContainerStyles(containerStyles)).toEqual({
      [customCssProps.styleTabsUnderlineColor]: '#1d4ed8',
      [customCssProps.styleTabsUnderlineWidth]: '3px',
      [customCssProps.styleTabsUnderlineBorderRadius]: '2px',
      [customCssProps.styleTabsDividerColor]: '#cbd5e1',
      [customCssProps.styleTabsDividerWidth]: '2px',
    });
  });
});

describe('getTabHeaderStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles tab header style configurations', () => {
    expect(getTabHeaderStyles(undefined)).toBeUndefined();
    expect(getTabHeaderStyles({})).toBeUndefined();

    const headerStyles = {
      headerDivider: {
        color: '#94a3b8',
        width: '3px',
      },
    };

    expect(getTabHeaderStyles(headerStyles)).toEqual({
      [customCssProps.styleTabsHeaderDividerColor]: '#94a3b8',
      [customCssProps.styleTabsHeaderDividerWidth]: '3px',
    });
  });

  test('returns undefined when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getTabHeaderStyles: getTabHeaderStylesNonCore } = await import('../styles');

    const style = {
      headerDivider: {
        color: '#94a3b8',
      },
    };

    const result = getTabHeaderStylesNonCore(style);

    expect(result).toBeUndefined();
  });
});
