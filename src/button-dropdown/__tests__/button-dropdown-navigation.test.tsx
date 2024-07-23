// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import ButtonDropdown from '../../../lib/components/button-dropdown';
import { ButtonDropdownProps, InternalButtonDropdownProps } from '../../../lib/components/button-dropdown/interfaces';
import InternalButtonDropdown from '../../../lib/components/button-dropdown/internal';
import createWrapper, { ButtonDropdownWrapper, ElementWrapper } from '../../../lib/components/test-utils/dom';
import { KeyCode } from '../../internal/keycode';

import categoryElementStyles from '../../../lib/components/button-dropdown/category-elements/styles.css.js';
import itemStyles from '../../../lib/components/button-dropdown/item-element/styles.css.js';
import styles from '../../../lib/components/button-dropdown/styles.css.js';

const items: ButtonDropdownProps.Items = [
  { id: 'i1', text: 'item1', description: 'Item 1 description' },
  {
    text: 'category1',
    items: [
      { id: 'i2', text: 'item2' },
      { id: 'i3', text: 'item3' },
    ],
  },
  { id: 'i4', text: 'item4' },
];

const renderInternalButtonDropdown = (props: InternalButtonDropdownProps) => {
  const { baseElement } = render(<InternalButtonDropdown {...props} />);
  return new ButtonDropdownWrapper(baseElement as HTMLElement);
};

const renderButtonDropdown = (props: ButtonDropdownProps) => {
  const renderResult = render(<ButtonDropdown {...props} />);
  return createWrapper(renderResult.container).findButtonDropdown()!;
};

function findHeader(wrapper: ButtonDropdownWrapper): ElementWrapper<HTMLElement> {
  return wrapper.findOpenDropdown()!.find(`.${styles.header}`)!;
}

describe('Button dropdown header', () => {
  it('is not visible by default', () => {
    const wrapper = renderInternalButtonDropdown({ items });

    wrapper.openDropdown();
    expect(findHeader(wrapper)).toBeFalsy();
  });

  it('renders a title', () => {
    const wrapper = renderInternalButtonDropdown({ items, title: 'Title' });

    wrapper.openDropdown();
    expect(findHeader(wrapper).getElement()).toHaveTextContent('Title');
  });

  it('renders a title and description', () => {
    const wrapper = renderInternalButtonDropdown({ items, title: 'Title', description: 'Description' });

    wrapper.openDropdown();
    expect(findHeader(wrapper).getElement()).toHaveTextContent('Title');
    expect(findHeader(wrapper).getElement()).toHaveTextContent('Description');
  });

  it('renders a description without a title', () => {
    const wrapper = renderInternalButtonDropdown({ items, description: 'Description' });

    wrapper.openDropdown();
    expect(findHeader(wrapper).getElement()).toHaveTextContent('Description');
  });
});

describe('Button dropdown navigate with mouse or keyboard', () => {
  it('should add class is-focused if highligted with keyboard and remove when using mouse', () => {
    const wrapper = renderButtonDropdown({ items });
    wrapper.openDropdown();
    act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
    expect(wrapper.findHighlightedItem()!.getElement()).toHaveClass(itemStyles['is-focused']);

    fireEvent.mouseMove(wrapper.findItemById('i4')!.getElement());
    expect(wrapper.findHighlightedItem()!.getElement()).not.toHaveClass(itemStyles['is-focused']);
  });

  it('should add class is-focused if highligted with keyboard and remove when mouse move on the same item', () => {
    const wrapper = renderButtonDropdown({ items });
    wrapper.openDropdown();
    act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
    expect(wrapper.findHighlightedItem()!.getElement()).toHaveClass(itemStyles['is-focused']);

    fireEvent.mouseMove(wrapper.findItemById('i1')!.getElement());
    expect(wrapper.findHighlightedItem()!.getElement()).not.toHaveClass(itemStyles['is-focused']);
  });

  it('should remove class is-focused from parent item when move focus from parent item to child item', () => {
    const wrapper = renderButtonDropdown({ items, expandableGroups: true });
    wrapper.openDropdown();
    act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.down));
    expect(wrapper.findByClassName(categoryElementStyles['expandable-header'])!.getElement()).toHaveClass(
      categoryElementStyles['is-focused']
    );
    act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.right));
    expect(wrapper.findByClassName(categoryElementStyles['expandable-header'])!.getElement()).not.toHaveClass(
      categoryElementStyles['is-focused']
    );
    expect(wrapper.findHighlightedItem()!.getElement()).toHaveClass(itemStyles['is-focused']);
  });
});
