// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Multiselect from '../../../lib/components/multiselect';
import createWrapper from '../../../lib/components/test-utils/dom';
import { MultiselectProps } from '../interfaces';

import selectableStyles from '../../../lib/components/internal/components/selectable-item/styles.css.js';

const renderMultiselect = (props: Partial<MultiselectProps>) => {
  const { container } = render(<Multiselect options={[]} selectedOptions={[]} onChange={() => null} {...props} />);
  return createWrapper(container).findMultiselect()!;
};

const createRenderOption = () =>
  jest.fn<React.ReactNode, [{ item: MultiselectProps.MultiselectItem }]>(() => <div>Custom</div>);

const lastRenderedItem = (renderOption: ReturnType<typeof createRenderOption>, type: string) => {
  const calls = renderOption.mock.calls.filter(([{ item }]) => item.type === type);
  const item = calls[calls.length - 1][0].item;
  return { selected: item.selected, indeterminate: item.type === 'item' ? undefined : item.indeterminate };
};

const rowOf = (element: HTMLElement) => element.closest(`.${selectableStyles['selectable-item']}`)!;

const values = (...values: string[]) => values.map(value => ({ value }));

describe('Multiselect select-all checkbox state', () => {
  test.each([
    { name: 'all selected', options: values('1', '2'), selected: values('1', '2'), expected: [true, false] },
    { name: 'some selected', options: values('1', '2'), selected: values('1'), expected: [false, true] },
    { name: 'none selected', options: values('1', '2'), selected: [], expected: [false, false] },
    {
      name: 'all selected, some filtered out',
      options: values('apple', 'banana'),
      selected: values('apple', 'banana'),
      filteringText: 'apple',
      expected: [true, false],
    },
    {
      name: 'all visible selected, a filtered out one is not',
      options: values('apple', 'banana'),
      selected: values('apple'),
      filteringText: 'apple',
      expected: [false, true],
    },
    {
      name: 'enabled selected, disabled not',
      options: [{ value: '1', disabled: true }, { value: '2' }],
      selected: values('2'),
      expected: [false, true],
    },
    {
      name: 'enabled and disabled selected',
      options: [{ value: '1', disabled: true }, { value: '2' }],
      selected: values('1', '2'),
      expected: [true, false],
    },
    { name: 'selected value not in options', options: values('1'), selected: values('x'), expected: [false, true] },
  ])('$name', ({ options, selected, filteringText, expected: [expectedSelected, expectedIndeterminate] }) => {
    const renderOption = createRenderOption();
    const wrapper = renderMultiselect({
      options,
      selectedOptions: selected,
      enableSelectAll: true,
      filteringType: filteringText ? 'auto' : 'none',
      renderOption,
    });
    wrapper.openDropdown();
    if (filteringText) {
      wrapper.findFilteringInput()!.setInputValue(filteringText);
    }

    expect(lastRenderedItem(renderOption, 'select-all')).toEqual({
      selected: expectedSelected,
      indeterminate: expectedIndeterminate,
    });
    expect(wrapper.findDropdown().findSelectAll()!.getElement()).toHaveAttribute(
      'aria-checked',
      String(expectedSelected)
    );
  });

  test('is not rendered when there are no options', () => {
    const renderOption = createRenderOption();
    const wrapper = renderMultiselect({
      options: [],
      selectedOptions: values('x'),
      enableSelectAll: true,
      renderOption,
    });
    wrapper.openDropdown();

    expect(renderOption.mock.calls.some(([{ item }]) => item.type === 'select-all')).toBe(false);
    expect(wrapper.findDropdown().findSelectAll()).toBeNull();
  });
});

describe('Multiselect group checkbox state', () => {
  test.each([
    {
      name: 'all children selected',
      children: values('a', 'b'),
      selected: values('a', 'b'),
      expected: [true, false, 'true'],
    },
    {
      name: 'some children selected',
      children: values('a', 'b'),
      selected: values('a'),
      expected: [false, true, 'mixed'],
    },
    {
      name: 'enabled children selected, a disabled child not',
      children: [{ value: 'a' }, { value: 'b', disabled: true }],
      selected: values('a'),
      expected: [false, true, 'mixed'],
    },
  ])('$name', ({ children, selected, expected: [expectedSelected, expectedIndeterminate, ariaChecked] }) => {
    const renderOption = createRenderOption();
    const wrapper = renderMultiselect({
      options: [{ label: 'Group', options: children }],
      selectedOptions: selected,
      renderOption,
    });
    wrapper.openDropdown();

    expect(lastRenderedItem(renderOption, 'group')).toEqual({
      selected: expectedSelected,
      indeterminate: expectedIndeterminate,
    });
    expect(wrapper.findDropdown().findGroup(1)!.getElement()).toHaveAttribute('aria-checked', ariaChecked);
  });
});

describe('Multiselect selected neighbour styling', () => {
  test('a row next to a fully selected group is styled as having a selected neighbour', () => {
    const wrapper = renderMultiselect({
      options: [{ value: 'c' }, { label: 'Group', options: values('a', 'b') }],
      selectedOptions: values('a', 'b'),
    });
    wrapper.openDropdown();

    const itemRow = rowOf(wrapper.findDropdown().findOptionByValue('c')!.getElement());
    expect(itemRow).toHaveClass(selectableStyles['next-item-selected']);
    const childRow = rowOf(wrapper.findDropdown().findOptionInGroup(1, 1)!.getElement());
    expect(childRow).toHaveClass(selectableStyles['previous-item-selected']);
  });

  test('the row after select-all is not styled as having a selected neighbour', () => {
    const wrapper = renderMultiselect({
      options: values('1', '2'),
      selectedOptions: values('1', '2'),
      enableSelectAll: true,
    });
    wrapper.openDropdown();

    const firstRow = rowOf(wrapper.findDropdown().findOptionByValue('1')!.getElement());
    expect(firstRow).not.toHaveClass(selectableStyles['previous-item-selected']);
  });
});

describe('Multiselect highlighted row announcement', () => {
  const highlight = (wrapper: ReturnType<typeof renderMultiselect>, target: HTMLElement) => {
    for (let i = 0; i < 5 && wrapper.findDropdown().findHighlightedOption()?.getElement() !== target; i++) {
      wrapper.findDropdown().findOptionsContainer()!.keydown(KeyCode.up);
    }
    expect(wrapper.findDropdown().findHighlightedOption()!.getElement()).toBe(target);
  };

  test('announces a fully selected group as selected', () => {
    const wrapper = renderMultiselect({
      options: [{ label: 'Group', options: values('a', 'b') }],
      selectedOptions: values('a', 'b'),
      selectedAriaLabel: 'Selected',
    });
    wrapper.openDropdown();
    highlight(wrapper, wrapper.findDropdown().findGroup(1)!.getElement());

    expect(wrapper.findDropdown().findHighlightedAriaLiveRegion()!.getElement().textContent).toMatch(/^Selected/);
  });

  test('does not announce select-all as selected', () => {
    const wrapper = renderMultiselect({
      options: values('1', '2'),
      selectedOptions: values('1', '2'),
      enableSelectAll: true,
      selectedAriaLabel: 'Selected',
    });
    wrapper.openDropdown();
    highlight(wrapper, wrapper.findDropdown().findSelectAll()!.getElement());

    expect(wrapper.findDropdown().findHighlightedAriaLiveRegion()!.getElement().textContent).not.toMatch(/^Selected/);
  });
});
