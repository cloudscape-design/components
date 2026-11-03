// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ItemCard, { ItemCardProps } from '../../../lib/components/item-card';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/item-card/styles.selectors.js';

function renderItemCard(props: ItemCardProps & { styleClassNames?: Record<string, string> } = {}) {
  const { container } = render(<ItemCard {...props}>Content</ItemCard>);
  return { container, wrapper: createWrapper(container).findItemCard()! };
}

const styleClassNames = { root: 'a', header: 'b', footer: 'c', unknown: 'd' };

describe('ItemCard Style API v2', () => {
  test('applies each slot class to its element and ignores unknown keys', () => {
    const { container, wrapper } = renderItemCard({ header: 'Header', footer: 'Footer', styleClassNames });
    expect(wrapper.getElement()).toHaveClass('a');
    expect(wrapper.findByClassName(styles.header)!.getElement()).toHaveClass('b');
    expect(wrapper.findFooter()!.getElement()).toHaveClass('c');
    expect(container.querySelectorAll('.a, .b, .c')).toHaveLength(3);
    expect(container.querySelector('.d')).toBeNull();
  });

  test.each(['default', 'embedded'] as const)('applies the header class in the %s variant', variant => {
    const { container, wrapper } = renderItemCard({ variant, description: 'Description', styleClassNames });
    expect(wrapper.findByClassName(styles.header)!.getElement()).toHaveClass('b');
    expect(container.querySelectorAll('.b')).toHaveLength(1);
  });

  test('does not render the header class when the header row is empty', () => {
    const { container, wrapper } = renderItemCard({ footer: 'Footer', styleClassNames });
    expect(wrapper.findByClassName(styles.header)).toBeNull();
    expect(container.querySelector('.b')).toBeNull();
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderItemCard({ header: 'Header', footer: 'Footer', styleClassNames });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
