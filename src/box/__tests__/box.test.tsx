// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Box, { BoxProps } from '../../../lib/components/box';
import BoxWrapper from '../../../lib/components/test-utils/dom/box';

import styles from '../../../lib/components/box/styles.css.js';

function renderBox(props: BoxProps = {}): BoxWrapper {
  const renderResult = render(<Box {...props}></Box>);
  const element = renderResult.container.querySelector<HTMLElement>(`.${BoxWrapper.rootSelector}`)!;
  return new BoxWrapper(element);
}

// Helper to get computed style property from element
function getStyleProperty(element: HTMLElement, property: string): string {
  return element.style.getPropertyValue(property) || (element.style as any)[property] || '';
}

function testClassNamesForProperty<PropertyType>(propertyName: string, values: Array<PropertyType>, prefix: string) {
  test(`sets the right className for ${propertyName} property`, () => {
    const expectedClassNames = values.map(suffix => styles[`${prefix}-${suffix}`]);
    values.forEach((value, index) => {
      const boxWrapper = renderBox({ [propertyName]: value });
      expect(boxWrapper.getElement()).toHaveClass(expectedClassNames[index]);
    });
  });
}
const variants = [
  'div',
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'p',
  'strong',
  'small',
  'code',
  'pre',
  'samp',
] as Array<BoxProps.Variant>;

describe('Box', () => {
  describe('variant property', () => {
    test('defaults to div', () => {
      const boxWrapper = renderBox({});
      expect(boxWrapper.getElement().tagName).toBe('DIV');
    });
    test('determines the tagName', () => {
      variants.forEach(variant => {
        const boxWrapper = renderBox({ variant });
        expect(boxWrapper.getElement().tagName).toBe(variant.toUpperCase());
      });
    });
    test('uses div as tag name when set to awsui-key-label', () => {
      const boxWrapper = renderBox({ variant: 'awsui-key-label' });
      expect(boxWrapper.getElement().tagName).toBe('DIV');
    });
    test('uses span as tag name when set to awsui-value-large', () => {
      const boxWrapper = renderBox({ variant: 'awsui-value-large' });
      expect(boxWrapper.getElement().tagName).toBe('SPAN');
    });
    test('uses code as tag name when set to awsui-inline-code', () => {
      const boxWrapper = renderBox({ variant: 'awsui-inline-code' });
      expect(boxWrapper.getElement().tagName).toBe('CODE');
    });
  });
  describe('tagOverride property', () => {
    const tagOverrides = [
      'div',
      'span',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'p',
      'strong',
      'small',
      'code',
      'pre',
      'samp',
    ] as const;
    test('overrides the default tag', () => {
      tagOverrides.forEach(override => {
        const boxWrapper = renderBox({ tagOverride: override });
        expect(boxWrapper.getElement().tagName).toBe(override.toUpperCase());
      });
    });
    test('overrides the variant tag', () => {
      variants.forEach(variant => {
        tagOverrides.forEach(override => {
          const boxWrapper = renderBox({ variant, tagOverride: override });
          expect(boxWrapper.getElement().tagName).toBe(override.toUpperCase());
        });
      });
    });
  });

  ['margin', 'padding'].forEach(spacingType => {
    describe(`${spacingType} property`, () => {
      const sizes = ['n', 'xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'] as Array<BoxProps.SpacingSize>;

      test(`sets the right inline styles for all-sides ${spacingType}s`, () => {
        sizes.forEach(size => {
          const boxWrapper = renderBox({ [spacingType]: size });
          const element = boxWrapper.getElement();
          // Spacing is now applied via inline styles using CSS custom properties
          const blockStyle = getStyleProperty(element, `${spacingType}-block`);
          const inlineStyle = getStyleProperty(element, `${spacingType}-inline`);
          expect(blockStyle).toContain('var(--space-scaled-');
          expect(inlineStyle).toContain('var(--space-');
        });
      });

      test(`sets the right inline styles for side-specific ${spacingType}s`, () => {
        const sideToStyleProperty: Record<string, string> = {
          top: `${spacingType}-block-start`,
          bottom: `${spacingType}-block-end`,
          left: `${spacingType}-inline-start`,
          right: `${spacingType}-inline-end`,
          horizontal: `${spacingType}-inline`,
          vertical: `${spacingType}-block`,
        };
        const sides = ['top', 'right', 'bottom', 'left', 'horizontal', 'vertical'];
        sides.forEach(side => {
          sizes.forEach(size => {
            const boxWrapper = renderBox({ [spacingType]: { [side]: size } });
            const element = boxWrapper.getElement();
            const styleProperty = sideToStyleProperty[side];
            const styleValue = getStyleProperty(element, styleProperty);
            expect(styleValue).toContain('var(--space-');
          });
        });
      });

      test(`sets the right inline styles for ${spacingType}s when multiple sides are provided`, () => {
        const boxWrapper = renderBox({
          [spacingType]: { top: 'n', right: 'xxs', bottom: 'xs', left: 's', horizontal: 'm', vertical: 'l' },
        });
        const element = boxWrapper.getElement();
        // Check that multiple style properties are set
        expect(getStyleProperty(element, `${spacingType}-block-start`)).toContain('var(--space-');
        expect(getStyleProperty(element, `${spacingType}-inline-end`)).toContain('var(--space-');
        expect(getStyleProperty(element, `${spacingType}-block-end`)).toContain('var(--space-');
        expect(getStyleProperty(element, `${spacingType}-inline-start`)).toContain('var(--space-');
        expect(getStyleProperty(element, `${spacingType}-inline`)).toContain('var(--space-');
        expect(getStyleProperty(element, `${spacingType}-block`)).toContain('var(--space-');
      });
    });
  });
  testClassNamesForProperty<BoxProps.Display>('display', ['block', 'inline', 'inline-block', 'none'], 'd');
  testClassNamesForProperty<BoxProps.TextAlign>('textAlign', ['left', 'center', 'right'], 't');
  testClassNamesForProperty<BoxProps.Float>('float', ['left', 'right'], 'f');
  testClassNamesForProperty<BoxProps.FontSize>(
    'fontSize',
    ['body-s', 'body-m', 'heading-xs', 'heading-s', 'heading-m', 'heading-l', 'heading-xl', 'display-l'],
    'font-size'
  );
  testClassNamesForProperty<BoxProps.FontWeight>('fontWeight', ['light', 'normal', 'bold'], 'font-weight');
  testClassNamesForProperty<BoxProps.Color>(
    'color',
    [
      'inherit',
      'text-label',
      'text-body-secondary',
      'text-status-error',
      'text-status-success',
      'text-status-info',
      'text-status-inactive',
      'text-status-warning',
    ],
    'color'
  );

  test(`sets default classNames when color, fontSize, and fontWeight are not set`, () => {
    const boxWrapper = renderBox({});
    expect(boxWrapper.getElement()).toHaveClass(styles['color-default']);
    expect(boxWrapper.getElement()).toHaveClass(styles['font-size-default']);
    expect(boxWrapper.getElement()).toHaveClass(styles['font-weight-default']);
  });

  test('sets tabindex for h1 variant', () => {
    const boxWrapper = renderBox({ variant: 'h1' });
    expect(boxWrapper.getElement()).toHaveAttribute('tabindex', '-1');
  });

  describe('native attributes', () => {
    it('adds native attributes', () => {
      const { container } = render(<Box nativeAttributes={{ 'data-testid': 'my-test-id' }} />);
      expect(container.querySelector('[data-testid="my-test-id"]')).not.toBeNull();
    });
    it('concatenates class names', () => {
      const { container } = render(<Box nativeAttributes={{ className: 'additional-class' }} />);
      expect(container.firstChild).toHaveClass(styles.root);
      expect(container.firstChild).toHaveClass('additional-class');
    });
  });

  describe('spacing edge cases', () => {
    test('applies no spacing styles when margin and padding are empty objects', () => {
      const boxWrapper = renderBox({ margin: {}, padding: {} });
      const element = boxWrapper.getElement();
      // Empty objects should not add any spacing styles
      expect(getStyleProperty(element, 'margin-block')).toBe('');
      expect(getStyleProperty(element, 'margin-inline')).toBe('');
      expect(getStyleProperty(element, 'padding-block')).toBe('');
      expect(getStyleProperty(element, 'padding-inline')).toBe('');
    });

    test('uses scaled tokens for vertical spacing and non-scaled for horizontal', () => {
      const boxWrapper = renderBox({ margin: { top: 'm', left: 'm' } });
      const element = boxWrapper.getElement();
      // Vertical (block) uses scaled tokens
      expect(getStyleProperty(element, 'margin-block-start')).toContain('var(--space-scaled-');
      // Horizontal (inline) uses non-scaled tokens
      expect(getStyleProperty(element, 'margin-inline-start')).toMatch(/var\(--space-[^s]/);
    });

    test('applies "n" size correctly for zero spacing', () => {
      const boxWrapper = renderBox({ margin: 'n', padding: 'n' });
      const element = boxWrapper.getElement();
      expect(getStyleProperty(element, 'margin-block')).toContain('var(--space-scaled-none');
      expect(getStyleProperty(element, 'margin-inline')).toContain('var(--space-none');
      expect(getStyleProperty(element, 'padding-block')).toContain('var(--space-scaled-none');
      expect(getStyleProperty(element, 'padding-inline')).toContain('var(--space-none');
    });

    test('applies partial side-specific spacing correctly', () => {
      const boxWrapper = renderBox({ margin: { top: 's' }, padding: { horizontal: 'l' } });
      const element = boxWrapper.getElement();
      // Only specified sides should have styles
      expect(getStyleProperty(element, 'margin-block-start')).toContain('var(--space-');
      expect(getStyleProperty(element, 'margin-block-end')).toBe('');
      expect(getStyleProperty(element, 'padding-inline')).toContain('var(--space-');
      expect(getStyleProperty(element, 'padding-block')).toBe('');
    });
  });

  test('uses div as tag name when set to awsui-gen-ai-label', () => {
    const boxWrapper = renderBox({ variant: 'awsui-gen-ai-label' });
    expect(boxWrapper.getElement().tagName).toBe('DIV');
  });
});
