// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render as renderJsx } from '@testing-library/react';
import dropdownStyles from '../../../lib/components/internal/components/dropdown/styles.selectors.js';
import createWrapper, { ElementWrapper } from '../../../lib/components/test-utils/dom';
import AutosuggestInput, { AutosuggestInputRef } from '../../../lib/components/autosuggest/autosuggest-input';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';
import '../../__a11y__/to-validate-a11y';
import { act } from 'react-dom/test-utils';

function render(jsx: React.ReactElement) {
  const { container, rerender } = renderJsx(jsx);
  const wrapper = createWrapper(container);
  return { container, wrapper, rerender };
}

function findInput(wrapper: ElementWrapper<Element>) {
  return wrapper.find('input')!;
}

function findOpenDropdown(wrapper: ElementWrapper<Element>) {
  return wrapper.find(`.${dropdownStyles.dropdown}[data-open=true]`);
}

describe('imperative interface', () => {
  test('focuses input and opens dropdown', () => {
    const ref = React.createRef<AutosuggestInputRef>();
    const { wrapper } = render(<AutosuggestInput ref={ref} value="" onChange={() => undefined} />);
    expect(findInput(wrapper).getElement()).not.toHaveFocus();
    expect(findOpenDropdown(wrapper)).toBe(null);
    ref.current!.focus();
    expect(findInput(wrapper).getElement()).toHaveFocus();
    expect(findOpenDropdown(wrapper)).not.toBe(null);
  });

  test('focuses input and keeps dropdown closed', () => {
    const ref = React.createRef<AutosuggestInputRef>();
    const { wrapper } = render(<AutosuggestInput ref={ref} value="" onChange={() => undefined} />);
    expect(findInput(wrapper).getElement()).not.toHaveFocus();
    expect(findOpenDropdown(wrapper)).toBe(null);
    ref.current!.focusNoOpen();
    expect(findInput(wrapper).getElement()).toHaveFocus();
    expect(findOpenDropdown(wrapper)).toBe(null);
  });

  test('selects input text', () => {
    const ref = React.createRef<AutosuggestInputRef>();
    const onChange = jest.fn();
    const { wrapper } = render(<AutosuggestInput ref={ref} value="123" onChange={onChange} />);
    const inputEl = findInput(wrapper).getElement() as any;
    expect(inputEl.selectionStart).toBe(3);
    expect(inputEl.selectionEnd).toBe(3);
    ref.current!.select();
    expect(inputEl.selectionStart).toBe(0);
    expect(inputEl.selectionEnd).toBe(3);
  });

  test('opens and closes dropdown', () => {
    const ref = React.createRef<AutosuggestInputRef>();
    const onChange = jest.fn();
    const { wrapper } = render(<AutosuggestInput ref={ref} value="123" onChange={onChange} />);
    expect(findOpenDropdown(wrapper)).toBe(null);
    act(() => ref.current!.open());
    expect(findOpenDropdown(wrapper)).not.toBe(null);
    act(() => ref.current!.close());
    expect(findOpenDropdown(wrapper)).toBe(null);
  });
});

describe('keyboard interactions', () => {
  test('closes dropdown on enter and opens it on arrow keys', () => {
    const { wrapper } = render(<AutosuggestInput value="" onChange={() => undefined} />);
    expect(findOpenDropdown(wrapper)).toBe(null);

    findInput(wrapper).keydown(KeyCode.down);
    expect(findOpenDropdown(wrapper)).not.toBe(null);

    findInput(wrapper).keydown(KeyCode.enter);
    expect(findOpenDropdown(wrapper)).toBe(null);

    findInput(wrapper).keydown(KeyCode.up);
    expect(findOpenDropdown(wrapper)).not.toBe(null);
  });

  test('onPressEnter can prevent dropdown from closing', () => {
    const { wrapper } = render(<AutosuggestInput value="" onChange={() => undefined} onPressEnter={() => true} />);
    expect(findOpenDropdown(wrapper)).toBe(null);

    findInput(wrapper).keydown(KeyCode.down);
    expect(findOpenDropdown(wrapper)).not.toBe(null);

    findInput(wrapper).keydown(KeyCode.enter);
    expect(findOpenDropdown(wrapper)).not.toBe(null);
  });

  test('closes dropdown and clears input on esc', () => {
    const onChange = jest.fn();
    const { wrapper, rerender } = render(<AutosuggestInput value="1" onChange={onChange} />);
    expect(findOpenDropdown(wrapper)).toBe(null);

    findInput(wrapper).keydown(KeyCode.down);
    expect(findOpenDropdown(wrapper)).not.toBe(null);

    findInput(wrapper).keydown(KeyCode.escape);
    expect(findOpenDropdown(wrapper)).toBe(null);
    expect(onChange).toBeCalledTimes(0);

    findInput(wrapper).keydown(KeyCode.escape);
    expect(findOpenDropdown(wrapper)).toBe(null);
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(expect.objectContaining({ detail: { value: '' } }));

    rerender(<AutosuggestInput value="" onChange={onChange} />);

    findInput(wrapper).keydown(KeyCode.escape);
    expect(findOpenDropdown(wrapper)).toBe(null);
    expect(onChange).toBeCalledTimes(1);
  });

  test('calls respective keyboard handlers on keypress', () => {
    const onPressArrowUp = jest.fn();
    const onPressArrowDown = jest.fn();
    const onPressEnter = jest.fn();
    const onKeyDown = jest.fn();
    const { wrapper } = render(
      <AutosuggestInput
        value="1"
        onChange={() => undefined}
        onPressArrowUp={onPressArrowUp}
        onPressArrowDown={onPressArrowDown}
        onPressEnter={onPressEnter}
        onKeyDown={onKeyDown}
      />
    );

    findInput(wrapper).keydown(KeyCode.down);
    expect(onPressArrowDown).toBeCalledTimes(1);
    expect(onKeyDown).toBeCalledTimes(0);

    findInput(wrapper).keydown(KeyCode.up);
    expect(onPressArrowUp).toBeCalledTimes(1);
    expect(onKeyDown).toBeCalledTimes(0);

    findInput(wrapper).keydown(KeyCode.enter);
    expect(onPressEnter).toBeCalledTimes(1);
    expect(onKeyDown).toBeCalledTimes(1);

    findInput(wrapper).keydown(KeyCode.escape);
    expect(onKeyDown).toBeCalledTimes(2);

    findInput(wrapper).keydown(KeyCode.left);
    expect(onKeyDown).toBeCalledTimes(3);

    findInput(wrapper).keydown(KeyCode.enter);
    expect(onPressEnter).toBeCalledTimes(1);
    expect(onKeyDown).toBeCalledTimes(4);

    findInput(wrapper).keydown(KeyCode.right);
    expect(onKeyDown).toBeCalledTimes(5);
  });
});
