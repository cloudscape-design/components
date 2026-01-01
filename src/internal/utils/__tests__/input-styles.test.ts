// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import customCssProps from '../../generated/custom-css-properties';
import { getInputStylesCss, InputStyleProps } from '../input-styles';

// Mock the environment module
jest.mock('../../environment', () => ({
  SYSTEM: 'core',
}));

const fullStyle: InputStyleProps = {
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
      readonly: '#f5f5f5',
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
      readonly: '#666666',
    },
  },
  placeholder: {
    color: '#999999',
    fontSize: '14px',
    fontStyle: 'italic',
    fontWeight: '400',
  },
};

describe('getInputStylesCss', () => {
  afterEach(() => {
    jest.resetModules();
  });

  describe('when SYSTEM is core', () => {
    test('returns full style object when all properties provided', () => {
      const result = getInputStylesCss(fullStyle);

      expect(result).toEqual({
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
        [customCssProps.styleBackgroundReadonly]: '#f5f5f5',
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
        [customCssProps.styleColorReadonly]: '#666666',
        [customCssProps.stylePlaceholderColor]: '#999999',
        [customCssProps.stylePlaceholderFontSize]: '14px',
        [customCssProps.stylePlaceholderFontWeight]: '400',
        [customCssProps.stylePlaceholderFontStyle]: 'italic',
      });
    });

    test('returns object with undefined values when style is undefined', () => {
      const result = getInputStylesCss(undefined);

      expect(result).toBeDefined();
      expect(result?.borderRadius).toBeUndefined();
      expect(result?.[customCssProps.styleBackgroundDefault]).toBeUndefined();
    });

    test('returns object with undefined values when style is empty object', () => {
      const result = getInputStylesCss({});

      expect(result).toBeDefined();
      expect(result?.borderRadius).toBeUndefined();
    });

    describe('requireRoot parameter', () => {
      test('returns undefined when requireRoot=true and style is undefined', () => {
        const result = getInputStylesCss(undefined, true);
        expect(result).toBeUndefined();
      });

      test('returns undefined when requireRoot=true and style.root is undefined', () => {
        const result = getInputStylesCss({}, true);
        expect(result).toBeUndefined();
      });

      test('returns undefined when requireRoot=true and style.root is missing', () => {
        const result = getInputStylesCss({ placeholder: { color: '#999' } }, true);
        expect(result).toBeUndefined();
      });

      test('returns style object when requireRoot=true and style.root is provided', () => {
        const result = getInputStylesCss({ root: { borderRadius: '4px' } }, true);
        expect(result).toBeDefined();
        expect(result?.borderRadius).toBe('4px');
      });
    });
  });

  describe('when SYSTEM is not core', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.doMock('../../environment', () => ({
        SYSTEM: 'visual-refresh',
      }));
    });

    test('returns undefined regardless of style input', async () => {
      const { getInputStylesCss: getInputStylesCssNonCore } = await import('../input-styles');

      expect(getInputStylesCssNonCore(fullStyle)).toBeUndefined();
      expect(getInputStylesCssNonCore(undefined)).toBeUndefined();
      expect(getInputStylesCssNonCore({})).toBeUndefined();
    });

    test('returns undefined even with requireRoot=true', async () => {
      const { getInputStylesCss: getInputStylesCssNonCore } = await import('../input-styles');

      expect(getInputStylesCssNonCore(fullStyle, true)).toBeUndefined();
    });
  });
});
