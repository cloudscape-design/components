// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Badge, { BadgeProps } from '../../../lib/components/badge';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/badge/styles.css.js';

function getNativeSpan(container: HTMLElement) {
  const wrapper = createWrapper(container);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

  (['blue', 'grey', 'green', 'red'] as Array<BadgeProps['color']>).forEach(color => {
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
