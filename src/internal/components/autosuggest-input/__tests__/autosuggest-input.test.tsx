// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render as renderJsx } from '@testing-library/react';
import { getFocusables } from '../../../../../lib/components/internal/components/focus-lock/utils';
import AutosuggestInputWrapper from '../../../../../lib/components/test-utils/dom/internal/autosuggest-input';
import AutosuggestInput, {
  AutosuggestInputRef,
} from '../../../../../lib/components/internal/components/autosuggest-input';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

function render(jsx: React.ReactElement) {
  const { container, rerender, getByTestId } = renderJsx(jsx);
  const wrapper = new AutosuggestInputWrapper(container);
  return { container, wrapper, rerender, getByTestId };
}

describe('imperative interface', () => {
  test('focuses input and opens dropdown', () => {
    const ref = React.createRef<AutosuggestInputRef>();
    const { wrapper } = render(<AutosuggestInput ref={ref} value="" onChange={() => undefined} />);
    expect(wrapper.findInput().findNativeInput().getElement()).not.toHaveFocus();
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    ref.current!.focus();
    expect(wrapper.findInput().findNativeInput().getElement()).toHaveFocus();
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);
  });

  test('focuses input and keeps dropdown closed', () => {
    const ref = React.createRef<AutosuggestInputRef>();
    const { wrapper } = render(<AutosuggestInput ref={ref} value="" onChange={() => undefined} />);
    expect(wrapper.findInput().findNativeInput().getElement()).not.toHaveFocus();
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    ref.current!.focus({ preventDropdown: true });
    expect(wrapper.findInput().findNativeInput().getElement()).toHaveFocus();
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
  });

  test('selects input text', () => {
    const ref = React.createRef<AutosuggestInputRef>();
    const onChange = jest.fn();
    const { wrapper } = render(<AutosuggestInput ref={ref} value="123" onChange={onChange} />);
    const inputEl = wrapper.findInput().findNativeInput().getElement() as any;
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
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    act(() => ref.current!.open());
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);
    act(() => ref.current!.close());
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
  });
});

describe('keyboard interactions', () => {
  test('closes dropdown on enter and opens it on arrow keys', () => {
    const { wrapper } = render(<AutosuggestInput value="" onChange={() => undefined} />);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);

    wrapper.findInput().findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);

    wrapper.findInput().findNativeInput().keydown(KeyCode.enter);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);

    wrapper.findInput().findNativeInput().keydown(KeyCode.up);
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);
  });

  test('onPressEnter can prevent dropdown from closing', () => {
    const { wrapper } = render(<AutosuggestInput value="" onChange={() => undefined} onPressEnter={() => true} />);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);

    wrapper.findInput().findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);

    wrapper.findInput().findNativeInput().keydown(KeyCode.enter);
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);
  });

  test('closes dropdown and clears input on esc', () => {
    const onChange = jest.fn();
    const { wrapper, rerender } = render(<AutosuggestInput value="1" onChange={onChange} />);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);

    wrapper.findInput().findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);

    wrapper.findInput().findNativeInput().keydown(KeyCode.escape);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    expect(onChange).toBeCalledTimes(0);

    wrapper.findInput().findNativeInput().keydown(KeyCode.escape);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(expect.objectContaining({ detail: { value: '' } }));

    rerender(<AutosuggestInput value="" onChange={onChange} />);

    wrapper.findInput().findNativeInput().keydown(KeyCode.escape);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
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

    wrapper.findInput().findNativeInput().keydown(KeyCode.down);
    expect(onPressArrowDown).toBeCalledTimes(1);
    expect(onKeyDown).toBeCalledTimes(0);

    wrapper.findInput().findNativeInput().keydown(KeyCode.up);
    expect(onPressArrowUp).toBeCalledTimes(1);
    expect(onKeyDown).toBeCalledTimes(0);

    wrapper.findInput().findNativeInput().keydown(KeyCode.enter);
    expect(onPressEnter).toBeCalledTimes(1);
    expect(onKeyDown).toBeCalledTimes(1);

    wrapper.findInput().findNativeInput().keydown(KeyCode.escape);
    expect(onKeyDown).toBeCalledTimes(2);

    wrapper.findInput().findNativeInput().keydown(KeyCode.left);
    expect(onKeyDown).toBeCalledTimes(3);

    wrapper.findInput().findNativeInput().keydown(KeyCode.enter);
    expect(onPressEnter).toBeCalledTimes(1);
    expect(onKeyDown).toBeCalledTimes(4);

    wrapper.findInput().findNativeInput().keydown(KeyCode.right);
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
    wrapper.findInput().findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);
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
    wrapper.findInput().findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);
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
    wrapper.findInput().findNativeInput().keydown(KeyCode.down);
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);
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
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    act(() => wrapper.findInput().setInputValue('2'));
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2' } }));
  });

  test('opens dropdown and calls onFocus when input receives focus', () => {
    const onFocus = jest.fn();
    const { wrapper } = render(<AutosuggestInput value="1" onChange={() => undefined} onFocus={onFocus} />);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    wrapper.findInput().findNativeInput().focus();
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);
    expect(onFocus).toHaveBeenCalled();
  });

  test('opens dropdown and calls onFocus when input loses focus', () => {
    const onBlur = jest.fn();
    const { wrapper } = render(<AutosuggestInput value="1" onChange={() => undefined} onBlur={onBlur} />);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    wrapper.findInput().findNativeInput().focus();
    wrapper.findInput().findNativeInput().blur();
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    expect(onBlur).toHaveBeenCalled();
  });

  test('calls onDelayedInput after small interval following the input value change', () => {
    jest.useFakeTimers();
    const onDelayedInput = jest.fn();
    const { wrapper } = render(
      <AutosuggestInput value="1" onChange={() => undefined} onDelayedInput={onDelayedInput} />
    );
    act(() => wrapper.findInput().setInputValue('2'));
    expect(onDelayedInput).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(onDelayedInput).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2' } }));
  });
});

describe('dropdown events', () => {
  test('fires onDropdownMouseDown when clicked inside dropdown', () => {
    const onDropdownMouseDown = jest.fn().mockImplementation(e => e.preventDefault());
    const { wrapper, getByTestId } = render(
      <div>
        <AutosuggestInput
          value="1"
          onChange={() => undefined}
          onDropdownMouseDown={onDropdownMouseDown}
          dropdownContent={<button data-testid="target">target</button>}
        />
      </div>
    );
    wrapper.findInput().findNativeInput().focus();
    getByTestId('target').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(onDropdownMouseDown).toBeCalledTimes(1);
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);
  });
});

describe('blur handling', () => {
  test('closes dropdown and fires onBlur if clicked outside', () => {
    const onBlur = jest.fn();
    const { wrapper, getByTestId } = render(
      <div>
        <button data-testid="target">target</button>
        <AutosuggestInput value="1" onChange={() => undefined} onBlur={onBlur} />
      </div>
    );
    wrapper.findInput().findNativeInput().focus();
    getByTestId('target').focus();
    expect(onBlur).toBeCalledTimes(1);
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
  });

  test('ignores clicks inside dropdown content', () => {
    const onBlur = jest.fn();
    const { wrapper, getByTestId } = render(
      <div>
        <AutosuggestInput
          value="1"
          onChange={() => undefined}
          onBlur={onBlur}
          dropdownContent={<button data-testid="target">target</button>}
        />
      </div>
    );
    wrapper.findInput().findNativeInput().focus();
    getByTestId('target').focus();
    expect(onBlur).not.toBeCalled();
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);
  });

  test('ignores clicks inside dropdown footer', () => {
    const onBlur = jest.fn();
    const { wrapper, getByTestId } = render(
      <div>
        <AutosuggestInput
          value="1"
          onChange={() => undefined}
          onBlur={onBlur}
          dropdownFooter={<button data-testid="target">target</button>}
        />
      </div>
    );
    wrapper.findInput().findNativeInput().focus();
    getByTestId('target').focus();
    expect(onBlur).not.toBeCalled();
    expect(wrapper.findDropdown()!.findOpenDropdown()).not.toBe(null);
  });
});
