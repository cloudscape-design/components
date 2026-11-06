// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';

import { OptionListProps } from '../../../lib/components/option-list';
import {
  blurList,
  clickOption,
  focusList,
  highlightedValue,
  pressKey,
  renderOptionList,
  selectedLabels,
  Stateful,
  StatefulProps,
} from './common';

import selectableItemStyles from '../../../lib/components/internal/components/selectable-item/styles.css.js';

// OptionList scrolls the highlighted option into view with `scrollIntoView`, which jsdom doesn't implement.
const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
let scrollIntoView: jest.Mock;

beforeEach(() => {
  scrollIntoView = HTMLElement.prototype.scrollIntoView = jest.fn();
});
afterEach(() => {
  HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
});

const lastScrolledValue = () =>
  (scrollIntoView.mock.instances[scrollIntoView.mock.instances.length - 1] as HTMLElement).dataset.value;

describe('OptionList focus and highlight', () => {
  const longOptions: OptionListProps.Option[] = [
    ...Array.from({ length: 9 }, (_, index) => ({ value: `${index}`, label: `Option ${index}` })),
    { value: 'special', label: 'Special' },
  ];

  const renderLongList = (props: StatefulProps = {}) => renderOptionList(<Stateful options={longOptions} {...props} />);

  test('does not scroll when a grouped list mounts without a highlight', () => {
    // Single-selection group headers are not interactive and render with data-mouse-target="-1",
    // the same index the list reports when nothing is highlighted.
    const twoGroups: OptionListProps.Options = [
      { value: 'group-1', label: 'Group 1', options: [{ value: '1', label: 'Option 1' }] },
      { value: 'group-2', label: 'Group 2', options: [{ value: '2', label: 'Option 2' }] },
    ];
    renderOptionList(<Stateful options={twoGroups} />);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  test('hovering highlights the option without scrolling, and leaving the list clears it', () => {
    const { wrapper } = renderLongList();
    fireEvent.mouseMove(wrapper.findOptionByIndex(5)!.getElement());
    expect(highlightedValue(wrapper)).toBe('4');
    expect(scrollIntoView).not.toHaveBeenCalled();
    fireEvent.mouseLeave(wrapper.getElement());
    expect(wrapper.findHighlightedOption()).toBeNull();
  });

  test('mouse leave keeps the highlight while the list has focus', () => {
    const { wrapper, listbox } = renderLongList();
    focusList(listbox);
    pressKey(listbox, KeyCode.down);
    fireEvent.mouseLeave(wrapper.getElement());
    expect(highlightedValue(wrapper)).toBe('1');
  });

  test('focus entry highlights and scrolls to the selected option with the keyboard style', () => {
    const { wrapper, listbox } = renderLongList({ initialSelected: ['special'] });
    focusList(listbox);
    const highlighted = wrapper.findHighlightedOption()!;
    expect(highlighted.getElement().dataset.value).toBe('special');
    expect(highlighted.getElement()).toHaveClass(selectableItemStyles['is-keyboard']);
    expect(wrapper.findOptions().filter(option => option.isHighlighted())).toHaveLength(1);
    expect(listbox).toHaveAttribute('aria-activedescendant', highlighted.getElement().id);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
    expect(lastScrolledValue()).toBe('special');
  });

  test('focus keeps a hover highlight, so a click selects the hovered option', () => {
    const { wrapper, listbox } = renderLongList({ initialSelected: ['special'] });
    // Hover while the list isn't focused, and keep the pointer over the list.
    fireEvent.mouseMove(wrapper.findOptionByIndex(5)!.getElement());
    focusList(listbox);
    // The hover highlight stays, instead of moving to the selected option.
    expect(highlightedValue(wrapper)).toBe('4');
    expect(scrollIntoView).not.toHaveBeenCalled();
    clickOption(wrapper, 5);
    expect(selectedLabels(wrapper)).toEqual(['Option 4']);
  });

  test('blur clears the highlight and aria-activedescendant, and the next focus highlights the selected option', () => {
    const { wrapper, listbox } = renderLongList();
    expect(listbox).not.toHaveAttribute('aria-activedescendant');
    focusList(listbox);
    expect(listbox).toHaveAttribute('aria-activedescendant', wrapper.findOptionByIndex(1)!.getElement().id);
    clickOption(wrapper, 10);
    expect(selectedLabels(wrapper)).toEqual(['Special']);
    blurList(listbox);
    expect(wrapper.findHighlightedOption()).toBeNull();
    expect(listbox).not.toHaveAttribute('aria-activedescendant');
    scrollIntoView.mockClear();
    focusList(listbox);
    expect(highlightedValue(wrapper)).toBe('special');
    expect(lastScrolledValue()).toBe('special');
  });

  test('keyboard moves scroll the highlighted option into view', () => {
    const { listbox } = renderLongList();
    focusList(listbox);
    scrollIntoView.mockClear();
    const scrolledValues = [KeyCode.down, KeyCode.end, KeyCode.home, KeyCode.up].map(keyCode => {
      pressKey(listbox, keyCode);
      return lastScrolledValue();
    });
    expect(scrolledValues).toEqual(['1', 'special', '0', 'special']);
  });

  test('hovering after keyboard navigation does not scroll', () => {
    const { wrapper, listbox } = renderLongList();
    focusList(listbox);
    scrollIntoView.mockClear();
    fireEvent.mouseMove(wrapper.findOptionByIndex(1)!.getElement());
    fireEvent.mouseMove(wrapper.findOptionByIndex(5)!.getElement());
    expect(highlightedValue(wrapper)).toBe('4');
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
