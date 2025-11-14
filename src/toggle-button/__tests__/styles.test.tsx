// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import customCssProps from '../../internal/generated/custom-css-properties';
import { getToggleButtonStyles } from '../style';

// Mock the environment module
jest.mock('../../internal/environment', () => ({
  SYSTEM: 'core',
}));

const STATES = ['default', 'disabled', 'hover', 'active', 'pressed'] as const;
const STATE_PROPERTIES = ['background', 'borderColor', 'boxShadow', 'color'] as const;

const CSS_PROPERTY_MAP = {
  background: {
    default: customCssProps.styleBackgroundDefault,
    disabled: customCssProps.styleBackgroundDisabled,
    hover: customCssProps.styleBackgroundHover,
    active: customCssProps.styleBackgroundActive,
    pressed: customCssProps.styleBackgroundPressed,
  },
  borderColor: {
    default: customCssProps.styleBorderColorDefault,
    disabled: customCssProps.styleBorderColorDisabled,
    hover: customCssProps.styleBorderColorHover,
    active: customCssProps.styleBorderColorActive,
    pressed: customCssProps.styleBorderColorPressed,
  },
  boxShadow: {
    default: customCssProps.styleBoxShadowDefault,
    disabled: customCssProps.styleBoxShadowDisabled,
    hover: customCssProps.styleBoxShadowHover,
    active: customCssProps.styleBoxShadowActive,
    pressed: customCssProps.styleBoxShadowPressed,
  },
  color: {
    default: customCssProps.styleColorDefault,
    disabled: customCssProps.styleColorDisabled,
    hover: customCssProps.styleColorHover,
    active: customCssProps.styleColorActive,
    pressed: customCssProps.styleColorPressed,
  },
} as const;

describe('getToggleButtonStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('returns empty nativeButtonStyles for undefined or empty style objects', () => {
    expect(getToggleButtonStyles(undefined)).toEqual({ nativeButtonStyles: {} });
    expect(getToggleButtonStyles({})).toEqual({ nativeButtonStyles: {} });
  });

  test('extracts only pressed states to nativeButtonStyles', () => {
    const allStyles = {
      root: {
        borderRadius: '4px',
        borderWidth: '1px',
        paddingBlock: '8px',
        paddingInline: '12px',
        background: {
          default: '#ffffff',
          disabled: '#f0f0f0',
          hover: '#fafafa',
          active: '#eeeeee',
          pressed: '#e0e0e0',
        },
        borderColor: {
          default: '#cccccc',
          disabled: '#e0e0e0',
          hover: '#999999',
          active: '#666666',
          pressed: '#0073bb',
        },
        boxShadow: {
          default: 'none',
          disabled: 'none',
          hover: '0 1px 2px rgba(0,0,0,0.1)',
          active: '0 1px 2px rgba(0,0,0,0.2)',
          pressed: '0 0 0 2px #0073bb',
        },
        color: {
          default: '#000000',
          disabled: '#999999',
          hover: '#000000',
          active: '#000000',
          pressed: '#0073bb',
        },
        focusRing: {
          borderColor: '#0073bb',
          borderRadius: '6px',
          borderWidth: '2px',
        },
      },
    };

    const result = getToggleButtonStyles(allStyles);

    // Should only contain pressed states
    expect(result).toEqual({
      nativeButtonStyles: {
        [customCssProps.styleBackgroundPressed]: '#e0e0e0',
        [customCssProps.styleBorderColorPressed]: '#0073bb',
        [customCssProps.styleBoxShadowPressed]: '0 0 0 2px #0073bb',
        [customCssProps.styleColorPressed]: '#0073bb',
      },
    });

    // Should NOT contain non-pressed states (these are handled by InternalButton)
    expect(result.nativeButtonStyles).not.toHaveProperty('borderRadius');
    expect(result.nativeButtonStyles).not.toHaveProperty('borderWidth');
    expect(result.nativeButtonStyles).not.toHaveProperty(customCssProps.styleBackgroundDefault);
    expect(result.nativeButtonStyles).not.toHaveProperty(customCssProps.styleBackgroundHover);
  });

  test('returns empty nativeButtonStyles when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getToggleButtonStyles: getToggleButtonStylesNonCore } = await import('../style');

    const result = getToggleButtonStylesNonCore({ root: { borderRadius: '4px' } });

    expect(result).toEqual({ nativeButtonStyles: {} });
  });

  describe('individual root properties', () => {
    const rootProperties = {
      borderRadius: '8px',
      borderWidth: '2px',
      paddingBlock: '10px',
      paddingInline: '16px',
    };

    Object.entries(rootProperties).forEach(([property, value]) => {
      test(`${property} only - not extracted (handled by InternalButton)`, () => {
        const result = getToggleButtonStyles({ root: { [property]: value } });

        // These properties are passed to InternalButton via the style prop
        // and are not extracted to nativeButtonStyles
        expect(result).toEqual({
          nativeButtonStyles: {},
        });
      });
    });
  });

  describe('state properties', () => {
    STATE_PROPERTIES.forEach(property => {
      describe(`${property}`, () => {
        test('pressed state only', () => {
          const testValue = `test-${property}-pressed`;
          const style = {
            root: {
              [property]: { pressed: testValue },
            },
          };

          const result = getToggleButtonStyles(style);

          // Pressed state should be extracted to nativeButtonStyles
          expect(result).toEqual({
            nativeButtonStyles: {
              [CSS_PROPERTY_MAP[property].pressed]: testValue,
            },
          });
        });

        ['default', 'disabled', 'hover', 'active'].forEach(state => {
          test(`${state} only - not extracted (handled by InternalButton)`, () => {
            const testValue = `test-${property}-${state}`;
            const style = {
              root: {
                [property]: { [state]: testValue },
              },
            };

            const result = getToggleButtonStyles(style);

            // Non-pressed states are not extracted
            expect(result).toEqual({
              nativeButtonStyles: {},
            });
          });
        });

        test('all states together - only pressed extracted', () => {
          const allStateValues = STATES.reduce(
            (acc, state) => ({
              ...acc,
              [state]: `test-${property}-${state}`,
            }),
            {}
          );

          const style = { root: { [property]: allStateValues } };
          const result = getToggleButtonStyles(style);

          // Only pressed state should be in nativeButtonStyles
          expect(result).toEqual({
            nativeButtonStyles: {
              [CSS_PROPERTY_MAP[property].pressed]: `test-${property}-pressed`,
            },
          });
        });
      });
    });
  });

  describe('focusRing properties', () => {
    const focusRingProperties = {
      borderColor: { prop: customCssProps.styleFocusRingBorderColor, value: '#10b981' },
      borderRadius: { prop: customCssProps.styleFocusRingBorderRadius, value: '10px' },
      borderWidth: { prop: customCssProps.styleFocusRingBorderWidth, value: '3px' },
    };

    Object.entries(focusRingProperties).forEach(([property, { value }]) => {
      test(`${property} only - not extracted (handled by InternalButton)`, () => {
        const result = getToggleButtonStyles({
          root: { focusRing: { [property]: value } },
        });

        // focusRing properties are passed to InternalButton via the style prop
        expect(result).toEqual({
          nativeButtonStyles: {},
        });
      });
    });

    test('all focusRing properties together - not extracted (handled by InternalButton)', () => {
      const result = getToggleButtonStyles({
        root: {
          focusRing: {
            borderColor: '#10b981',
            borderRadius: '10px',
            borderWidth: '3px',
          },
        },
      });

      // focusRing properties are passed to InternalButton via the style prop
      expect(result).toEqual({
        nativeButtonStyles: {},
      });
    });
  });

  test('handles mixed property types - only pressed states extracted', () => {
    const result = getToggleButtonStyles({
      root: {
        borderRadius: '8px',
        paddingBlock: '10px',
        background: { default: '#3b82f6', pressed: '#1e40af' },
        color: { hover: '#ffffff', pressed: '#f0f0f0' },
        focusRing: { borderColor: '#3b82f6' },
      },
    });

    // Only pressed states should be extracted
    expect(result).toEqual({
      nativeButtonStyles: {
        [customCssProps.styleBackgroundPressed]: '#1e40af',
        [customCssProps.styleColorPressed]: '#f0f0f0',
      },
    });

    // Other properties are passed to InternalButton via the style prop
    expect(result.nativeButtonStyles).not.toHaveProperty('borderRadius');
    expect(result.nativeButtonStyles).not.toHaveProperty('paddingBlock');
    expect(result.nativeButtonStyles).not.toHaveProperty(customCssProps.styleBackgroundDefault);
    expect(result.nativeButtonStyles).not.toHaveProperty(customCssProps.styleColorHover);
    expect(result.nativeButtonStyles).not.toHaveProperty(customCssProps.styleFocusRingBorderColor);
  });
});
