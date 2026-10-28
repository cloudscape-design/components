// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';

import { OptionListProps } from '../../../lib/components/option-list';
import {
  clickOption,
  groupedOptions,
  highlightedValue,
  options,
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

  test('does not show a highlight before the user interacts with the list', () => {
    const { wrapper } = renderLongList({ initialSelected: ['2'] });
    expect(wrapper.findHighlightedOption()).toBeNull();
  });

  test('does not scroll when a grouped list mounts without a highlight', () => {
    // Single-selection group headers are not interactive and render with data-mouse-target="-1",
    // the same index the list reports when nothing is highlighted.
    const twoGroups: OptionListProps.Options = [
      { label: 'Group 1', options: [{ value: '1', label: 'Option 1' }] },
      { label: 'Group 2', options: [{ value: '2', label: 'Option 2' }] },
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

  test('focus entry highlights and scrolls to the first option', () => {
    const { wrapper, listbox } = renderLongList();
    fireEvent.focus(listbox);
    expect(highlightedValue(wrapper)).toBe('0');
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(lastScrolledValue()).toBe('0');
  });

  test('focus entry highlights the selected option with the keyboard style and scrolls to it', () => {
    const { wrapper, listbox } = renderLongList({ initialSelected: ['special'] });
    fireEvent.focus(listbox);
    const highlighted = wrapper.findHighlightedOption()!;
    expect(highlighted.getElement().dataset.value).toBe('special');
    expect(highlighted.getElement()).toHaveClass(selectableItemStyles['is-keyboard']);
    expect(wrapper.findOptions().filter(option => option.isHighlighted())).toHaveLength(1);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
    expect(lastScrolledValue()).toBe('special');
  });

  test('focus entry highlights the first selected option in list order, not selection order', () => {
    const { wrapper, listbox } = renderLongList({ selectionType: 'multi', initialSelected: ['special', '2'] });
    fireEvent.focus(listbox);
    expect(highlightedValue(wrapper)).toBe('2');
    expect(lastScrolledValue()).toBe('2');
  });

  test('keyboard focus entry replaces a hover highlight with the selected option', () => {
    const { wrapper, listbox } = renderLongList({ initialSelected: ['special'] });
    // Hover while the list isn't focused, and keep the pointer over the list.
    fireEvent.mouseMove(wrapper.findOptionByIndex(5)!.getElement());
    expect(highlightedValue(wrapper)).toBe('4');

    fireEvent.focus(listbox);
    const highlighted = wrapper.findHighlightedOption()!;
    expect(highlighted.getElement().dataset.value).toBe('special');
    expect(highlighted.getElement()).toHaveClass(selectableItemStyles['is-keyboard']);
    expect(lastScrolledValue()).toBe('special');
  });

  test('keyboard focus entry replaces a hover highlight with the first option when nothing is selected', () => {
    const { wrapper, listbox } = renderLongList();
    fireEvent.mouseMove(wrapper.findOptionByIndex(5)!.getElement());
    fireEvent.focus(listbox);
    expect(highlightedValue(wrapper)).toBe('0');
    expect(wrapper.findHighlightedOption()!.getElement()).toHaveClass(selectableItemStyles['is-keyboard']);
    expect(lastScrolledValue()).toBe('0');
  });

  test('focus from a pointer adds no highlight and does not scroll', () => {
    const { wrapper, listbox } = renderLongList({ initialSelected: ['special'] });
    fireEvent.mouseDown(listbox);
    fireEvent.focus(listbox);
    expect(wrapper.findHighlightedOption()).toBeNull();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  test('focus after selecting with the mouse highlights and scrolls to the selected option', () => {
    const { wrapper, listbox } = renderLongList();
    // Real focus, so the mousedown below lands on an already focused list.
    act(() => listbox.focus());
    fireEvent.mouseDown(listbox);
    clickOption(wrapper, 10);
    expect(selectedLabels(wrapper)).toEqual(['Special']);
    act(() => listbox.blur());
    scrollIntoView.mockClear();
    act(() => listbox.focus());
    expect(highlightedValue(wrapper)).toBe('special');
    expect(lastScrolledValue()).toBe('special');
  });

  test('keyboard moves scroll the highlighted option into view', () => {
    const { listbox } = renderLongList();
    fireEvent.focus(listbox);
    scrollIntoView.mockClear();
    const scrolledValues = [KeyCode.down, KeyCode.end, KeyCode.home, KeyCode.up].map(keyCode => {
      pressKey(listbox, keyCode);
      return lastScrolledValue();
    });
    expect(scrolledValues).toEqual(['1', 'special', '0', 'special']);
    expect(scrollIntoView).toHaveBeenCalledTimes(4);
  });

  test('repeating a keyboard move that keeps the highlight scrolls it into view again', () => {
    const { listbox } = renderLongList();
    fireEvent.focus(listbox);
    pressKey(listbox, KeyCode.end);
    scrollIntoView.mockClear();
    pressKey(listbox, KeyCode.end);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(lastScrolledValue()).toBe('special');
  });

  test('a keyboard highlight of the hovered option scrolls it into view', () => {
    const { wrapper, listbox } = renderLongList();
    fireEvent.mouseMove(wrapper.findOptionByValue('special')!.getElement());
    expect(scrollIntoView).not.toHaveBeenCalled();
    fireEvent.keyDown(listbox, { key: 's' });
    expect(highlightedValue(wrapper)).toBe('special');
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(lastScrolledValue()).toBe('special');
  });

  test('hovering after keyboard navigation does not scroll', () => {
    const { wrapper, listbox } = renderLongList();
    fireEvent.focus(listbox);
    scrollIntoView.mockClear();
    fireEvent.mouseMove(wrapper.findOptionByIndex(1)!.getElement());
    fireEvent.mouseMove(wrapper.findOptionByIndex(5)!.getElement());
    expect(highlightedValue(wrapper)).toBe('4');
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});

describe('OptionList highlight when options change', () => {
  const fruit = (value: string) => ({ value, label: value });

  const activeDescendant = (listbox: HTMLElement) => {
    const id = listbox.getAttribute('aria-activedescendant');
    return id === null ? null : document.getElementById(id);
  };

  test('clears the highlight when the highlighted option is removed, and arrow keys still move it', () => {
    const { wrapper, listbox, rerender } = renderOptionList(<Stateful />);
    fireEvent.focus(listbox);
    pressKey(listbox, KeyCode.end);
    expect(highlightedValue(wrapper)).toBe('c');

    rerender(<Stateful options={[options[0]]} />);
    expect(wrapper.findHighlightedOption()).toBeNull();
    expect(listbox).not.toHaveAttribute('aria-activedescendant');

    pressKey(listbox, KeyCode.down);
    expect(highlightedValue(wrapper)).toBe('a');
    expect(activeDescendant(listbox)).toBe(wrapper.findOptionByValue('a')!.getElement());
  });

  test('keeps the keyboard highlight on the same option when options are reordered or inserted, without scrolling', () => {
    const { wrapper, listbox, rerender } = renderOptionList(
      <Stateful options={['apple', 'banana', 'cherry'].map(fruit)} />
    );
    fireEvent.focus(listbox);
    pressKey(listbox, KeyCode.down);
    expect(highlightedValue(wrapper)).toBe('banana');
    scrollIntoView.mockClear();

    rerender(<Stateful options={['date', 'cherry', 'banana', 'apple'].map(fruit)} />);
    const banana = wrapper.findOptionByValue('banana')!.getElement();
    expect(highlightedValue(wrapper)).toBe('banana');
    expect(banana).toHaveClass(selectableItemStyles['is-keyboard']);
    expect(activeDescendant(listbox)).toBe(banana);
    expect(scrollIntoView).not.toHaveBeenCalled();

    pressKey(listbox, KeyCode.down);
    expect(highlightedValue(wrapper)).toBe('apple');
  });

  test('keeps the mouse highlight on the same option when options are reordered', () => {
    const { wrapper, rerender } = renderOptionList(<Stateful options={['apple', 'banana', 'cherry'].map(fruit)} />);
    fireEvent.mouseMove(wrapper.findOptionByValue('banana')!.getElement());

    rerender(<Stateful options={['banana', 'apple', 'cherry'].map(fruit)} />);
    expect(highlightedValue(wrapper)).toBe('banana');
    expect(wrapper.findHighlightedOption()!.getElement()).not.toHaveClass(selectableItemStyles['is-keyboard']);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  test('multi: keeps a highlighted group header when groups are reordered', () => {
    const { wrapper, listbox, rerender } = renderOptionList(
      <Stateful selectionType="multi" options={groupedOptions} />
    );
    fireEvent.focus(listbox);
    pressKey(listbox, KeyCode.end);
    pressKey(listbox, KeyCode.up);
    pressKey(listbox, KeyCode.up);
    expect(wrapper.findGroupHeaderByValue('storage')!.isHighlighted()).toBe(true);

    rerender(<Stateful selectionType="multi" options={[groupedOptions[1], groupedOptions[0]]} />);
    expect(wrapper.findGroupHeaderByValue('storage')!.isHighlighted()).toBe(true);
    expect(wrapper.findGroupHeaderByValue('compute')!.isHighlighted()).toBe(false);
    expect(activeDescendant(listbox)).toContainElement(wrapper.findGroupHeaderByValue('storage')!.getElement());
  });
});
