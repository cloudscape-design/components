// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render as renderJsx } from '@testing-library/react';
import inputStyles from '../../../lib/components/input/styles.selectors.js';
import dropdownStyles from '../../../lib/components/internal/components/dropdown/styles.selectors.js';
import { getFocusables } from '../../../lib/components/internal/components/focus-lock/utils';
import createWrapper, { ElementWrapper, InputWrapper } from '../../../lib/components/test-utils/dom';
import AutosuggestInput, { AutosuggestInputRef } from '../../../lib/components/autosuggest/autosuggest-input';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

function render(jsx: React.ReactElement) {
  const { container, rerender } = renderJsx(jsx);
  const wrapper = createWrapper(container) as ElementWrapper<HTMLElement>;
  return { container, wrapper, rerender };
}

function findInput(wrapper: ElementWrapper<Element>) {
  return wrapper.findComponent(`.${inputStyles['input-container']}`, InputWrapper)!;
}
function findNativeInput(wrapper: ElementWrapper<Element>) {
  return findInput(wrapper).findNativeInput()!;
}
function findOpenDropdown(wrapper: ElementWrapper<Element>) {
  return wrapper.find(`.${dropdownStyles.dropdown}[data-open=true]`)!;
}

describe('imperative interface', () => {
  test('focuses input and opens dropdown', () => {
    const ref = React.createRef<AutosuggestInputRef>();
    const { wrapper } = render(<AutosuggestInput ref={ref} value="" onChange={() => undefined} />);
    expect(findNativeInput(wrapper).getElement()).not.toHaveFocus();
    expect(findOpenDropdown(wrapper)).toBe(null);
    ref.current!.focus();
    expect(findNativeInput(wrapper).getElement()).toHaveFocus();
    expect(findOpenDropdown(wrapper)).not.toBe(null);
  });

  test('focuses input and keeps dropdown closed', () => {
    const ref = React.createRef<AutosuggestInputRef>();
    const { wrapper } = render(<AutosuggestInput ref={ref} value="" onChange={() => undefined} />);
    expect(findNativeInput(wrapper).getElement()).not.toHaveFocus();
    expect(findOpenDropdown(wrapper)).toBe(null);
    ref.current!.focusNoOpen();
    expect(findNativeInput(wrapper).getElement()).toHaveFocus();
    expect(findOpenDropdown(wrapper)).toBe(null);
  });

  test('selects input text', () => {
    const ref = React.createRef<AutosuggestInputRef>();
    const onChange = jest.fn();
    const { wrapper } = render(<AutosuggestInput ref={ref} value="123" onChange={onChange} />);
    const inputEl = findNativeInput(wrapper).getElement() as any;
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

    findNativeInput(wrapper).keydown(KeyCode.down);
    expect(findOpenDropdown(wrapper)).not.toBe(null);

    findNativeInput(wrapper).keydown(KeyCode.enter);
    expect(findOpenDropdown(wrapper)).toBe(null);

    findNativeInput(wrapper).keydown(KeyCode.up);
    expect(findOpenDropdown(wrapper)).not.toBe(null);
  });

  test('onPressEnter can prevent dropdown from closing', () => {
    const { wrapper } = render(<AutosuggestInput value="" onChange={() => undefined} onPressEnter={() => true} />);
    expect(findOpenDropdown(wrapper)).toBe(null);

    findNativeInput(wrapper).keydown(KeyCode.down);
    expect(findOpenDropdown(wrapper)).not.toBe(null);

    findNativeInput(wrapper).keydown(KeyCode.enter);
    expect(findOpenDropdown(wrapper)).not.toBe(null);
  });

  test('closes dropdown and clears input on esc', () => {
    const onChange = jest.fn();
    const { wrapper, rerender } = render(<AutosuggestInput value="1" onChange={onChange} />);
    expect(findOpenDropdown(wrapper)).toBe(null);

    findNativeInput(wrapper).keydown(KeyCode.down);
    expect(findOpenDropdown(wrapper)).not.toBe(null);

    findNativeInput(wrapper).keydown(KeyCode.escape);
    expect(findOpenDropdown(wrapper)).toBe(null);
    expect(onChange).toBeCalledTimes(0);

    findNativeInput(wrapper).keydown(KeyCode.escape);
    expect(findOpenDropdown(wrapper)).toBe(null);
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(expect.objectContaining({ detail: { value: '' } }));

    rerender(<AutosuggestInput value="" onChange={onChange} />);

    findNativeInput(wrapper).keydown(KeyCode.escape);
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

    findNativeInput(wrapper).keydown(KeyCode.down);
    expect(onPressArrowDown).toBeCalledTimes(1);
    expect(onKeyDown).toBeCalledTimes(0);

    findNativeInput(wrapper).keydown(KeyCode.up);
    expect(onPressArrowUp).toBeCalledTimes(1);
    expect(onKeyDown).toBeCalledTimes(0);

    findNativeInput(wrapper).keydown(KeyCode.enter);
    expect(onPressEnter).toBeCalledTimes(1);
    expect(onKeyDown).toBeCalledTimes(1);

    findNativeInput(wrapper).keydown(KeyCode.escape);
    expect(onKeyDown).toBeCalledTimes(2);

    findNativeInput(wrapper).keydown(KeyCode.left);
    expect(onKeyDown).toBeCalledTimes(3);

    findNativeInput(wrapper).keydown(KeyCode.enter);
    expect(onPressEnter).toBeCalledTimes(1);
    expect(onKeyDown).toBeCalledTimes(4);

    findNativeInput(wrapper).keydown(KeyCode.right);
    expect(onKeyDown).toBeCalledTimes(5);
  });
});

describe('dropdown focus trap', () => {
  test('does not trap drodpown focus when content and footer are not interactive', () => {
    const { wrapper } = render(
      <AutosuggestInput
        value="1"
        onChange={() => undefined}
        dropdownContent={<div>content</div>}
        dropdownFooter={<div>footer</div>}
      />
    );
    findNativeInput(wrapper).keydown(KeyCode.down);
    expect(findOpenDropdown(wrapper)).not.toBe(null);
    expect(getFocusables(wrapper.getElement()).length).toBe(1);
  });

  test('traps drodpown focus when content is interactive', () => {
    const { wrapper } = render(
      <AutosuggestInput
        value="1"
        onChange={() => undefined}
        dropdownContent={
          <div>
            <button>content click</button>
          </div>
        }
        dropdownFooter={<div>footer</div>}
      />
    );
    findNativeInput(wrapper).keydown(KeyCode.down);
    expect(findOpenDropdown(wrapper)).not.toBe(null);
    expect(getFocusables(wrapper.getElement()).length).toBeGreaterThan(2);
  });

  test('traps drodpown focus when footer is interactive', () => {
    const { wrapper } = render(
      <AutosuggestInput
        value="1"
        onChange={() => undefined}
        dropdownContent={<div>content</div>}
        dropdownFooter={
          <div>
            <button>footer click</button>
          </div>
        }
      />
    );
    findNativeInput(wrapper).keydown(KeyCode.down);
    expect(findOpenDropdown(wrapper)).not.toBe(null);
    expect(getFocusables(wrapper.getElement()).length).toBeGreaterThan(2);
  });
});

describe('input events', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test('opens dropdown and calls onChange when input changes', () => {
    const onChange = jest.fn();
    const { wrapper } = render(<AutosuggestInput value="1" onChange={onChange} />);
    expect(findOpenDropdown(wrapper)).toBe(null);
    act(() => findInput(wrapper).setInputValue('2'));
    expect(findOpenDropdown(wrapper)).not.toBe(null);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2' } }));
  });

  test('opens dropdown and calls onFocus when input receives focus', () => {
    const onFocus = jest.fn();
    const { wrapper } = render(<AutosuggestInput value="1" onChange={() => undefined} onFocus={onFocus} />);
    expect(findOpenDropdown(wrapper)).toBe(null);
    findNativeInput(wrapper).focus();
    expect(findOpenDropdown(wrapper)).not.toBe(null);
    expect(onFocus).toHaveBeenCalled();
  });

  test('opens dropdown and calls onFocus when input loses focus', () => {
    const onBlur = jest.fn();
    const { wrapper } = render(<AutosuggestInput value="1" onChange={() => undefined} onBlur={onBlur} />);
    expect(findOpenDropdown(wrapper)).toBe(null);
    findNativeInput(wrapper).focus();
    findNativeInput(wrapper).blur();
    expect(findOpenDropdown(wrapper)).toBe(null);
    expect(onBlur).toHaveBeenCalled();
  });

  test('calls onDelayedInput after small interval following the input value change', () => {
    jest.useFakeTimers();
    const onDelayedInput = jest.fn();
    const { wrapper } = render(
      <AutosuggestInput value="1" onChange={() => undefined} onDelayedInput={onDelayedInput} />
    );
    act(() => findInput(wrapper).setInputValue('2'));
    expect(onDelayedInput).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(onDelayedInput).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2' } }));
  });
});
