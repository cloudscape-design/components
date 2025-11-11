// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import customCssProps from '../../internal/generated/custom-css-properties';
import { getPromptInputStyles } from '../styles';

// Mock the environment module
jest.mock('../../internal/environment', () => ({
  SYSTEM: 'core',
}));

describe('getPromptInputStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles all possible style configurations', () => {
    expect(getPromptInputStyles(undefined)).toEqual({});
    expect(getPromptInputStyles({})).toEqual({});

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

    expect(getPromptInputStyles(allStyles)).toEqual({
      borderRadius: '4px',
      borderWidth: '1px',
      fontSize: '14px',
      fontWeight: '400',
      paddingBlock: '8px',
      paddingInline: '12px',
      [customCssProps.promptInputStyleBackgroundDefault]: '#ffffff',
      [customCssProps.promptInputStyleBackgroundDisabled]: '#f0f0f0',
      [customCssProps.promptInputStyleBackgroundHover]: '#fafafa',
      [customCssProps.promptInputStyleBackgroundFocus]: '#ffffff',
      [customCssProps.promptInputStyleBackgroundReadonly]: '#ffffff',
      [customCssProps.promptInputStyleBorderColorDefault]: '#cccccc',
      [customCssProps.promptInputStyleBorderColorDisabled]: '#e0e0e0',
      [customCssProps.promptInputStyleBorderColorHover]: '#999999',
      [customCssProps.promptInputStyleBorderColorFocus]: '#0073bb',
      [customCssProps.promptInputStyleBorderColorReadonly]: '#e0e0e0',
      [customCssProps.promptInputStyleBoxShadowDefault]: 'none',
      [customCssProps.promptInputStyleBoxShadowDisabled]: 'none',
      [customCssProps.promptInputStyleBoxShadowHover]: '0 1px 2px rgba(0,0,0,0.1)',
      [customCssProps.promptInputStyleBoxShadowFocus]: '0 0 0 2px #0073bb',
      [customCssProps.promptInputStyleBoxShadowReadonly]: 'none',
      [customCssProps.promptInputStyleColorDefault]: '#000000',
      [customCssProps.promptInputStyleColorDisabled]: '#999999',
      [customCssProps.promptInputStyleColorHover]: '#000000',
      [customCssProps.promptInputStyleColorFocus]: '#000000',
      [customCssProps.promptInputStyleColorReadonly]: '#000000',
      [customCssProps.promptInputStylePlaceholderColor]: '#999999',
      [customCssProps.promptInputStylePlaceholderFontSize]: '14px',
      [customCssProps.promptInputStylePlaceholderFontWeight]: '400',
      [customCssProps.promptInputStylePlaceholderFontStyle]: 'italic',
    });
  });

  test('returns undefined when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getPromptInputStyles: getPromptInputStylesNonCore } = await import('../styles');

    const style = {
      root: {
        borderRadius: '4px',
      },
    };

    const result = getPromptInputStylesNonCore(style);

    expect(result).toEqual({});
  });
});
