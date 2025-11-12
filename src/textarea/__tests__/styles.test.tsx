// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import customCssProps from '../../internal/generated/custom-css-properties';
import { getTextareaStyles } from '../styles';

// Mock the environment module
jest.mock('../../internal/environment', () => ({
  SYSTEM: 'core',
}));

describe('getTextareaStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles all possible style configurations', () => {
    expect(getTextareaStyles(undefined)).toBeUndefined();
    expect(getTextareaStyles({})).toBeUndefined();

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

    expect(getTextareaStyles(allStyles)).toEqual({
      borderRadius: '4px',
      borderWidth: '1px',
      fontSize: '14px',
      fontWeight: '400',
      paddingBlock: '8px',
      paddingInline: '12px',
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

  test('returns undefined when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getTextareaStyles: getTextareaStylesNonCore } = await import('../styles');

    const style = {
      root: {
        borderRadius: '4px',
      },
    };

    const result = getTextareaStylesNonCore(style);

    expect(result).toBeUndefined();
  });
});
