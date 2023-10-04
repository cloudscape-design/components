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
});
