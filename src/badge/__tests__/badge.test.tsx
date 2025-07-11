// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Badge, { BadgeProps } from '../../../lib/components/badge';
import createWrapper from '../../../lib/components/test-utils/dom';
import customCssProps from '../../internal/generated/custom-css-properties';

import styles from '../../../lib/components/badge/styles.css.js';

function getNativeSpan(container: HTMLElement) {
  const wrapper = createWrapper(container);

  return wrapper.findBadge()!.getElement();
}

function renderBadge(component: React.ReactElement) {
  const { container } = render(component);
  return getNativeSpan(container);
}

describe('Badge', () => {
  describe('content (children)', () => {
    test('can be set to empty', () => {
      const badgeContent = '';
      const emptyBadge = renderBadge(<Badge>{badgeContent}</Badge>);
      expect(emptyBadge).toHaveTextContent('');
    });

    test('can be set to text', () => {
      const badgeWithContent = renderBadge(<Badge>This is the badge content</Badge>);
      expect(badgeWithContent).toHaveTextContent('This is the badge content');
    });
  });

  (
    [
      'blue',
      'grey',
      'green',
      'red',
      'severity-critical',
      'severity-high',
      'severity-medium',
      'severity-low',
      'severity-neutral',
    ] as Array<BadgeProps['color']>
  ).forEach(color => {
    test(`renders color ${color} correctly`, () => {
      const badge = renderBadge(<Badge color={color}>20</Badge>);
      expect(badge).toHaveClass(styles[`badge-color-${color}`]);
    });
  });

  test(`renders default color (grey) correctly`, () => {
    const badge = renderBadge(<Badge>20</Badge>);
    expect(badge).toHaveClass(styles[`badge-color-grey`]);
  });
});

describe('Style API', () => {
  test('custom properties', () => {
    const wrapper = renderBadge({
      children: 'Badge',
      style: {
        root: {
          background: '#fff',
          borderColor: '#fff',
          color: '#fff',
          focusRing: {
            borderColor: '#fff',
            borderRadius: '50px',
            borderWidth: '25px',
          },
        },
      },
    });

    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleBackgroundActive)).toBe('#fff');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleBackgroundDefault)).toBe('#fff');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleBackgroundDisabled)).toBe(
      '#fff'
    );
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleBackgroundHover)).toBe('#fff');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleBorderColorActive)).toBe('#fff');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleBorderColorDefault)).toBe(
      '#fff'
    );
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleBorderColorDisabled)).toBe(
      '#fff'
    );
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleBorderColorHover)).toBe('#fff');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleColorActive)).toBe('#fff');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleColorDefault)).toBe('#fff');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleColorDisabled)).toBe('#fff');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleColorHover)).toBe('#fff');
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleFocusRingBorderColor)).toBe(
      '#fff'
    );
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleFocusRingBorderRadius)).toBe(
      '50px'
    );
    expect(getComputedStyle(wrapper.getElement()).getPropertyValue(customCssProps.styleFocusRingBorderWidth)).toBe(
      '25px'
    );
  });
});
