// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Box, { BoxProps } from '../../../lib/components/box';
import customCssProps from '../../../lib/components/internal/generated/custom-css-properties';
import BoxWrapper from '../../../lib/components/test-utils/dom/box';

import styles from '../../../lib/components/box/styles.css.js';

function renderBox(props: BoxProps = {}): BoxWrapper {
  const renderResult = render(<Box {...props}></Box>);
  const element = renderResult.container.querySelector<HTMLElement>(`.${BoxWrapper.rootSelector}`)!;
  return new BoxWrapper(element);
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
      test(`sets the right classNames for all-sides ${spacingType}s`, () => {
        sizes.forEach(size => {
          const boxWrapper = renderBox({ [spacingType]: size });
          expect(boxWrapper.getElement()).toHaveClass(styles[`${spacingType.slice(0, 1)}-${size}`]);
        });
      });
      test(`sets the right classNames for side-specific ${spacingType}s`, () => {
        const sides = ['top', 'right', 'bottom', 'left', 'horizontal', 'vertical'];
        sides.forEach(side => {
          sizes.forEach(size => {
            const boxWrapper = renderBox({ [spacingType]: { [side]: size } });
            expect(boxWrapper.getElement()).toHaveClass(styles[`${spacingType.slice(0, 1)}-${side}-${size}`]);
          });
        });
      });
      test(`sets the right classNames for ${spacingType}s when multiple sides are provided`, () => {
        const boxWrapper = renderBox({
          [spacingType]: { top: 'n', right: 'xxs', bottom: 'xs', left: 's', horizontal: 'm', vertical: 'l' },
        });
        const expectedClassNames = ['top-n', 'right-xxs', 'bottom-xs', 'left-s', 'horizontal-m', 'vertical-l'].map(
          suffix => styles[`${spacingType.slice(0, 1)}-${suffix}`]
        );
        expectedClassNames.forEach(className => {
          expect(boxWrapper.getElement()).toHaveClass(className);
        });
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

  describe('visualAccent property', () => {
    test('renders the default div tag when no variant is set', () => {
      const boxWrapper = renderBox({ visualAccent: { color: 'indigo' } });
      expect(boxWrapper.getElement().tagName).toBe('DIV');
    });

    test('preserves the variant tag when combined with visualAccent', () => {
      const boxWrapper = renderBox({ variant: 'h4', visualAccent: { color: 'indigo' } });
      expect(boxWrapper.getElement().tagName).toBe('H4');
    });

    test('applies the base visual-accent class', () => {
      const boxWrapper = renderBox({ visualAccent: { color: 'indigo' } });
      expect(boxWrapper.getElement()).toHaveClass(styles['visual-accent']);
    });

    test('applies the correct color class', () => {
      const colors: Array<BoxProps.VisualAccent.Color> = [
        'red',
        'yellow',
        'indigo',
        'green',
        'orange',
        'purple',
        'mint',
        'lime',
        'grey',
      ];
      colors.forEach(color => {
        const boxWrapper = renderBox({ visualAccent: { color } });
        expect(boxWrapper.getElement()).toHaveClass(styles[`visual-accent-${color}`]);
      });
    });

    test('does not apply any accent class when visualAccent is not set', () => {
      const boxWrapper = renderBox({});
      const element = boxWrapper.getElement();
      expect(element.className).not.toMatch(/visual-accent/);
      expect(element.tagName).toBe('DIV');
    });

    test('defaults to the auto aspect ratio', () => {
      const boxWrapper = renderBox({ visualAccent: { color: 'indigo' } });
      expect(boxWrapper.getElement()).toHaveClass(styles['visual-accent-aspect-auto']);
    });

    test('applies the correct aspect ratio class', () => {
      const aspectRatios: Array<BoxProps.VisualAccent.AspectRatio> = ['auto', 'equal'];
      aspectRatios.forEach(aspectRatio => {
        const boxWrapper = renderBox({ visualAccent: { color: 'indigo', aspectRatio } });
        expect(boxWrapper.getElement()).toHaveClass(styles[`visual-accent-aspect-${aspectRatio}`]);
      });
    });

    test('applies the correct class for each t-shirt size borderRadius keyword', () => {
      const keywords: Array<BoxProps.VisualAccent.BorderRadius> = [
        'xxxs',
        'xxs',
        'xs',
        's',
        'm',
        'l',
        'xl',
        'xxl',
        'xxxl',
      ];
      keywords.forEach(borderRadius => {
        const boxWrapper = renderBox({ visualAccent: { color: 'indigo', borderRadius } });
        const element = boxWrapper.getElement();
        expect(element).toHaveClass(styles[`visual-accent-radius-${borderRadius}`]);
        // Keyword radii are applied via class, not the custom property.
        expect(element.style.getPropertyValue(customCssProps.boxVisualAccentBorderRadius)).toBe('');
      });
    });

    test('applies an arbitrary CSS borderRadius value through the custom property', () => {
      const boxWrapper = renderBox({ visualAccent: { color: 'indigo', borderRadius: '13px' } });
      const element = boxWrapper.getElement();
      expect(element.style.getPropertyValue(customCssProps.boxVisualAccentBorderRadius)).toBe('13px');
      expect(element.className).not.toMatch(/visual-accent-radius-/);
    });

    test('does not set the borderRadius custom property or class when borderRadius is not set', () => {
      const boxWrapper = renderBox({ visualAccent: { color: 'indigo' } });
      const element = boxWrapper.getElement();
      expect(element.style.getPropertyValue(customCssProps.boxVisualAccentBorderRadius)).toBe('');
      expect(element.className).not.toMatch(/visual-accent-radius-/);
    });

    test('renders a circle when combining equal aspect ratio and 50% borderRadius', () => {
      const boxWrapper = renderBox({ visualAccent: { color: 'indigo', aspectRatio: 'equal', borderRadius: '50%' } });
      const element = boxWrapper.getElement();
      expect(element).toHaveClass(styles['visual-accent-aspect-equal']);
      expect(element.style.getPropertyValue(customCssProps.boxVisualAccentBorderRadius)).toBe('50%');
    });

    test('tagOverride works with visualAccent', () => {
      const boxWrapper = renderBox({ visualAccent: { color: 'indigo' }, tagOverride: 'div' });
      expect(boxWrapper.getElement().tagName).toBe('DIV');
    });
  });
});
