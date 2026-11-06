// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';

import { focusList, groupedOptions, highlightedValue, pressKey, renderOptionList, Stateful } from './common';

const typeKey = (listbox: HTMLElement, key: string) => fireEvent.keyDown(listbox, { key });

describe('OptionList keyboard', () => {
  test('focus highlights the first option, arrows move with wrap-around, Home and End jump', () => {
    const { wrapper, listbox } = renderOptionList(<Stateful />);
    const optionId = (index: number) => wrapper.findOptionByIndex(index)!.getElement().id;

    focusList(listbox);
    expect(listbox).toHaveAttribute('aria-activedescendant', optionId(1));

    pressKey(listbox, KeyCode.down);
    expect(listbox).toHaveAttribute('aria-activedescendant', optionId(2));

    pressKey(listbox, KeyCode.up);
    pressKey(listbox, KeyCode.up);
    expect(listbox).toHaveAttribute('aria-activedescendant', optionId(3));

    pressKey(listbox, KeyCode.down);
    expect(listbox).toHaveAttribute('aria-activedescendant', optionId(1));

    pressKey(listbox, KeyCode.end);
    expect(listbox).toHaveAttribute('aria-activedescendant', optionId(3));

    pressKey(listbox, KeyCode.home);
    expect(listbox).toHaveAttribute('aria-activedescendant', optionId(1));
  });

  test('Enter and Space select the highlighted option', () => {
    const onChange = jest.fn();
    const { listbox } = renderOptionList(<Stateful selectionType="multi" onChange={onChange} />);
    focusList(listbox);

    pressKey(listbox, KeyCode.enter);
    expect(onChange).toHaveBeenLastCalledWith(['a']);

    pressKey(listbox, KeyCode.down);
    pressKey(listbox, KeyCode.space);
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);

    pressKey(listbox, KeyCode.space);
    expect(onChange).toHaveBeenLastCalledWith(['a']);
  });

  test('Escape is not handled and reaches the parent', () => {
    const onChange = jest.fn();
    const onParentKeyDown = jest.fn();
    const { listbox } = renderOptionList(
      <div onKeyDown={event => onParentKeyDown(event.keyCode)}>
        <Stateful onChange={onChange} />
      </div>
    );
    focusList(listbox);
    pressKey(listbox, KeyCode.escape);
    expect(onParentKeyDown).toHaveBeenCalledWith(KeyCode.escape);
    expect(onChange).not.toHaveBeenCalled();
  });

  describe('type-ahead', () => {
    test('typing a character highlights the first option that starts with it', () => {
      const { wrapper, listbox } = renderOptionList(<Stateful />);
      focusList(listbox);
      typeKey(listbox, 't');
      expect(highlightedValue(wrapper)).toBe('c');
      expect(listbox).toHaveAttribute('aria-activedescendant', wrapper.findOptionByValue('c')!.getElement().id);
    });

    test('multi: typing can highlight a group header', () => {
      const { wrapper, listbox } = renderOptionList(<Stateful selectionType="multi" options={groupedOptions} />);
      focusList(listbox);
      typeKey(listbox, 's');
      expect(wrapper.findGroupHeaderByValue('storage')!.isHighlighted()).toBe(true);
    });
  });
});
