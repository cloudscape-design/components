// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Badge, { BadgeProps } from '../../../lib/components/badge';
import createWrapper from '../../../lib/components/test-utils/dom';

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
  test('all style properties', () => {
    const badge = renderBadge(
      <Badge
        style={{
          root: {
            background: 'rgb(255, 255, 255)',
            borderColor: 'rgb(0, 0, 0)',
            borderRadius: '8px',
            borderWidth: '2px',
            paddingBlock: '4px',
            paddingInline: '8px',
          },
        }}
      >
        Badge
      </Badge>
    );

    expect(badge.style.background).toBe('rgb(255, 255, 255)');
    expect(badge.style.borderColor).toBe('rgb(0, 0, 0)');
    expect(badge.style.borderRadius).toBe('8px');
    expect(badge.style.borderWidth).toBe('2px');
    expect(badge.style.paddingBlock).toBe('4px');
    expect(badge.style.paddingInline).toBe('8px');
  });
});
