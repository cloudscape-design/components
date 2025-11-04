// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import customCssProps from '../../internal/generated/custom-css-properties';
import { getInputStyles } from '../styles';
import { parsePaddingInline } from '../utils';

// Mock the environment module
jest.mock('../../internal/environment', () => ({
  SYSTEM: 'core',
}));

describe('parsePaddingInline', () => {
  test('returns undefined for both start and end when input is undefined', () => {
    expect(parsePaddingInline(undefined)).toEqual({ start: undefined, end: undefined });
  });

  test('handles single value - applies to both start and end', () => {
    expect(parsePaddingInline('10px')).toEqual({ start: '10px', end: '10px' });
    expect(parsePaddingInline('1rem')).toEqual({ start: '1rem', end: '1rem' });
    expect(parsePaddingInline('0')).toEqual({ start: '0', end: '0' });
  });

  test('handles shorthand notation - first value is start, second is end', () => {
    expect(parsePaddingInline('10px 20px')).toEqual({ start: '10px', end: '20px' });
    expect(parsePaddingInline('1rem 2rem')).toEqual({ start: '1rem', end: '2rem' });
    expect(parsePaddingInline('5px 10px')).toEqual({ start: '5px', end: '10px' });
  });

  test('handles extra whitespace', () => {
    expect(parsePaddingInline('  10px  20px  ')).toEqual({ start: '10px', end: '20px' });
    expect(parsePaddingInline('10px    20px')).toEqual({ start: '10px', end: '20px' });
  });

  test('ignores values beyond the first two', () => {
    expect(parsePaddingInline('10px 20px 30px 40px')).toEqual({ start: '10px', end: '20px' });
  });
});

describe('getInputStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles all possible style configurations', () => {
    expect(getInputStyles(undefined)).toBeUndefined();
    expect(getInputStyles({})).toBeUndefined();

    const allStyles = {
      root: {
        borderRadius: '4px',
        borderWidth: '1px',
        fontSize: '14px',
        fontWeight: '400',
        paddingBlock: '8px',
        paddingInline: '12px',
        backgroundColor: {
          default: '#ffffff',
          disabled: '#f0f0f0',
          hover: '#fafafa',
          focus: '#ffffff',
          readonly: '#ffffff',
        },
        borderColor: {
          default: '#cccccc',
          disabled: '#e0e0e0',
          hover: '#999999',
          focus: '#0073bb',
          readonly: '#e0e0e0',
        },
        boxShadow: {
          default: 'none',
          disabled: 'none',
          hover: '0 1px 2px rgba(0,0,0,0.1)',
          focus: '0 0 0 2px #0073bb',
          readonly: 'none',
        },
        color: {
          default: '#000000',
          disabled: '#999999',
          hover: '#000000',
          focus: '#000000',
          readonly: '#000000',
        },
      },
      placeholder: {
        color: '#999999',
        fontSize: '14px',
        fontWeight: '400',
        fontStyle: 'italic',
      },
    };

    expect(getInputStyles(allStyles)).toEqual({
      borderRadius: '4px',
      borderWidth: '1px',
      fontSize: '14px',
      fontWeight: '400',
      paddingBlock: '8px',
      [customCssProps.stylePaddingInline]: '12px',
      [customCssProps.stylePaddingInlineStart]: '12px',
      [customCssProps.stylePaddingInlineEnd]: '12px',
      [customCssProps.styleBackgroundDefault]: '#ffffff',
      [customCssProps.styleBackgroundDisabled]: '#f0f0f0',
      [customCssProps.styleBackgroundHover]: '#fafafa',
      [customCssProps.styleBackgroundFocus]: '#ffffff',
      [customCssProps.styleBackgroundReadonly]: '#ffffff',
      [customCssProps.styleBorderColorDefault]: '#cccccc',
      [customCssProps.styleBorderColorDisabled]: '#e0e0e0',
      [customCssProps.styleBorderColorHover]: '#999999',
      [customCssProps.styleBorderColorFocus]: '#0073bb',
      [customCssProps.styleBorderColorReadonly]: '#e0e0e0',
      [customCssProps.styleBoxShadowDefault]: 'none',
      [customCssProps.styleBoxShadowDisabled]: 'none',
      [customCssProps.styleBoxShadowHover]: '0 1px 2px rgba(0,0,0,0.1)',
      [customCssProps.styleBoxShadowFocus]: '0 0 0 2px #0073bb',
      [customCssProps.styleBoxShadowReadonly]: 'none',
      [customCssProps.styleColorDefault]: '#000000',
      [customCssProps.styleColorDisabled]: '#999999',
      [customCssProps.styleColorHover]: '#000000',
      [customCssProps.styleColorFocus]: '#000000',
      [customCssProps.styleColorReadonly]: '#000000',
      [customCssProps.stylePlaceholderColor]: '#999999',
      [customCssProps.stylePlaceholderFontSize]: '14px',
      [customCssProps.stylePlaceholderFontWeight]: '400',
      [customCssProps.stylePlaceholderFontStyle]: 'italic',
    });
  });

  test('handles shorthand paddingInline values correctly', () => {
    const styleWithShorthand = {
      root: {
        paddingInline: '10px 20px',
      },
    };

    const result = getInputStyles(styleWithShorthand);

    expect(result).toEqual({
      [customCssProps.stylePaddingInline]: '10px 20px',
      [customCssProps.stylePaddingInlineStart]: '10px',
      [customCssProps.stylePaddingInlineEnd]: '20px',
    });
  });

  test('handles single value paddingInline correctly', () => {
    const styleWithSingleValue = {
      root: {
        paddingInline: '15px',
      },
    };

    const result = getInputStyles(styleWithSingleValue);

    expect(result).toEqual({
      [customCssProps.stylePaddingInline]: '15px',
      [customCssProps.stylePaddingInlineStart]: '15px',
      [customCssProps.stylePaddingInlineEnd]: '15px',
    });
  });

  test('does not add padding properties when paddingInline is not provided', () => {
    const styleWithoutPadding = {
      root: {
        fontSize: '14px',
      },
    };

    const result = getInputStyles(styleWithoutPadding);

    expect(result).toEqual({
      fontSize: '14px',
    });
    expect(result).not.toHaveProperty(customCssProps.stylePaddingInline);
    expect(result).not.toHaveProperty(customCssProps.stylePaddingInlineStart);
    expect(result).not.toHaveProperty(customCssProps.stylePaddingInlineEnd);
  });

  test('returns undefined when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getInputStyles: getInputStylesNonCore } = await import('../styles');

    const style = {
      root: {
        borderRadius: '4px',
      },
    };

    const result = getInputStylesNonCore(style);

    expect(result).toBeUndefined();
  });
});
