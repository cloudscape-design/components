// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { createEvent, fireEvent, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/component-toolkit/internal';

import createWrapper from '../../../lib/components/test-utils/dom';
import { highlightedValue, pressKey, renderOptionList, Stateful } from './common';

describe('OptionList keyboard', () => {
  test('focus highlights the first option, arrows move with wrap-around, Home and End jump', () => {
    const { wrapper, listbox } = renderOptionList(<Stateful />);
    const optionId = (index: number) => wrapper.findOptionByIndex(index)!.getElement().id;

    fireEvent.focus(listbox);
    expect(listbox).toHaveAttribute('aria-activedescendant', optionId(1));

    pressKey(listbox, KeyCode.down);
    expect(listbox).toHaveAttribute('aria-activedescendant', optionId(2));

    pressKey(listbox, KeyCode.up);
    pressKey(listbox, KeyCode.up);
    expect(listbox).toHaveAttribute('aria-activedescendant', optionId(3));

    pressKey(listbox, KeyCode.down);
    expect(listbox).toHaveAttribute('aria-activedescendant', optionId(1));

    // Home and End also prevent the browser from scrolling the page.
    const endEvent = createEvent.keyDown(listbox, { keyCode: KeyCode.end });
    fireEvent(listbox, endEvent);
    expect(endEvent.defaultPrevented).toBe(true);
    expect(listbox).toHaveAttribute('aria-activedescendant', optionId(3));

    const homeEvent = createEvent.keyDown(listbox, { keyCode: KeyCode.home });
    fireEvent(listbox, homeEvent);
    expect(homeEvent.defaultPrevented).toBe(true);
    expect(listbox).toHaveAttribute('aria-activedescendant', optionId(1));
  });

  test('Enter and Space select the highlighted option', () => {
    const onChange = jest.fn();
    const { listbox } = renderOptionList(<Stateful selectionType="multi" onChange={onChange} />);
    fireEvent.focus(listbox);

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
    const { container } = render(
      <div onKeyDown={event => onParentKeyDown(event.keyCode)}>
        <Stateful onChange={onChange} />
      </div>
    );
    const listbox = createWrapper(container).findOptionList()!.find('[role="listbox"]')!.getElement();
    fireEvent.focus(listbox);
    pressKey(listbox, KeyCode.escape);
    expect(onParentKeyDown).toHaveBeenCalledWith(KeyCode.escape);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('type-ahead after Space selects moves the highlight to the matching option', () => {
    const onChange = jest.fn();
    const { wrapper, listbox } = renderOptionList(<Stateful selectionType="multi" onChange={onChange} />);
    fireEvent.focus(listbox);
    fireEvent.keyDown(listbox, { key: ' ', keyCode: KeyCode.space });
    expect(onChange).toHaveBeenLastCalledWith(['a']);
    fireEvent.keyDown(listbox, { key: 't' });
    expect(highlightedValue(wrapper)).toBe('c');
  });

  test('blur clears the highlight and aria-activedescendant', () => {
    const { wrapper, listbox } = renderOptionList(<Stateful />);
    expect(listbox).not.toHaveAttribute('aria-activedescendant');
    fireEvent.focus(listbox);
    expect(wrapper.findHighlightedOption()).not.toBeNull();
    expect(listbox).toHaveAttribute('aria-activedescendant');
    fireEvent.blur(listbox);
    expect(wrapper.findHighlightedOption()).toBeNull();
    expect(listbox).not.toHaveAttribute('aria-activedescendant');
  });
});
