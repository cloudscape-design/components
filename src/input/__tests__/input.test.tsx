// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Input, { InputProps } from '../../../lib/components/input';
import FormField from '../../../lib/components/form-field';
import styles from '../../../lib/components/input/styles.css.js';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderInput(props: Omit<InputProps, 'value'> & { value?: string } & React.RefAttributes<InputProps.Ref> = {}) {
  const { container, rerender } = render(<Input value="" onChange={jest.fn()} {...props} />);
  const wrapper = createWrapper(container).findInput()!;
  return {
    rerender,
    wrapper,
    input: wrapper.findNativeInput().getElement(),
  };
}

describe('Input', () => {
  test('sets container props only on the container', () => {
    const props = {
      // set on component container
      'data-testid': 'data-testid',
      className: 'className',
      id: 'containerid',
    };
    const { container } = render(<Input value="" onChange={jest.fn()} {...props} />);
    const componentContainer = container.firstElementChild!;
    const input = createWrapper(container).findInput()!.findNativeInput().getElement();

    expect(componentContainer).toHaveAttribute('data-testid', 'data-testid');
    expect(componentContainer.getAttribute('class')).toContain('className');
    expect(componentContainer).toHaveAttribute('id', 'containerid');

    expect(input).not.toHaveAttribute('data-testid');
    expect(input.getAttribute('class')).not.toContain('className');
    expect(input).not.toHaveAttribute('id', 'containerid');
  });

  test('does not pass unknown props to the internal native input', () => {
    const { input } = renderInput({
      //@ts-expect-error there is no min prop on our component
      min: 0,
    });

    expect(input).not.toHaveAttribute('min');
  });

  describe('type', () => {
    test('is set to text by default', () => {
      const { input } = renderInput();
      expect(input).toHaveAttribute('type', 'text');
    });
    test('can be set to of the valid types', () => {
      const types: InputProps.Type[] = ['text', 'password', 'search', 'number', 'email', 'url'];
      const { input, rerender } = renderInput();
      types.forEach(validType => {
        rerender(<Input type={validType} value="" />);
        expect(input).toHaveAttribute('type', validType);
      });
    });
    test('silently accepts invalid types', () => {
      const { input } = renderInput({
        //@ts-expect-error there is no such value on our component
        type: 'unknown',
      });
      expect(input).toHaveAttribute('type', 'unknown');
    });
    it('can be turned into a search type input', () => {
      const { wrapper } = renderInput({ type: 'search', value: 'test' });
      expect(wrapper.findNativeInput()!.getElement()).toHaveAttribute('type', 'search');
      expect(wrapper.findClearButton()!.getElement()).not.toBeNull();
    });
  });

  describe('input mode', () => {
    test('is not set by default', () => {
      const { input } = renderInput();
      expect(input).not.toHaveAttribute('inputmode');
    });
    test('can be set', () => {
      const { input } = renderInput({ inputMode: 'decimal' });
      expect(input).toHaveAttribute('inputmode', 'decimal');
    });
  });

  describe('step', () => {
    test('is not set by default', () => {
      const { input } = renderInput();
      expect(input).not.toHaveAttribute('step');
    });
    test('can be set', () => {
      const { input } = renderInput({ step: 0.1 });
      expect(input).toHaveAttribute('step', '0.1');
    });
  });

  describe('value', () => {
    test('is set to an empy string by default in order to force controlled mode', () => {
      const { input } = renderInput();
      expect(input).toHaveAttribute('value', '');
    });
    test('can be set', () => {
      const { input } = renderInput({ value: 'value' });
      expect(input).toHaveAttribute('value', 'value');
    });
    test('can be obtained through getInputValue API', () => {
      const { wrapper } = renderInput({ value: 'value' });
      expect(wrapper.getInputValue()).toBe('value');
    });
  });

  describe('placeholder', () => {
    test('is not set by default', () => {
      const { input } = renderInput();
      expect(input).not.toHaveAttribute('placeholder');
    });
    test('can be set', () => {
      const { input } = renderInput({ placeholder: 'placeholder' });
      expect(input).toHaveAttribute('placeholder', 'placeholder');
    });
  });

  describe('name', () => {
    test('is not set by default', () => {
      const { input } = renderInput();
      expect(input).not.toHaveAttribute('name');
    });
    test('can be set', () => {
      const { input } = renderInput({ name: 'name' });
      expect(input).toHaveAttribute('name', 'name');
    });
  });

  describe('autocomplete', () => {
    test('is enabled by default', () => {
      const { input } = renderInput();
      expect(input).toHaveAttribute('autocomplete', 'on');
    });

    test('can be disabled', () => {
      const { input } = renderInput({ autoComplete: false });

      expect(input).toHaveAttribute('autocomplete', 'off');
    });

    test('can have custom string values', () => {
      const { input } = renderInput({ autoComplete: 'new-password' });
      expect(input).toHaveAttribute('autocomplete', 'new-password');
    });

    test('can be disabled with custom string value', () => {
      const { input } = renderInput({ autoComplete: 'off' });
      expect(input).toHaveAttribute('autocomplete', 'off');
    });
  });

  describe('spellcheck', () => {
    test('keeps default behavior if not set', () => {
      const { input } = renderInput();
      expect(input).not.toHaveAttribute('spellcheck');
    });

    test('can explicitly activate spellchecking', () => {
      const { input } = renderInput({ spellcheck: true });
      expect(input).toHaveAttribute('spellcheck', 'true');
    });

    test('can explicitly deactivate spellchecking', () => {
      const { input } = renderInput({ spellcheck: false });
      expect(input).toHaveAttribute('spellcheck', 'false');
    });
  });

  describe('disabled state', () => {
    test('is not set by default', () => {
      const { input } = renderInput();
      expect(input).not.toHaveAttribute('disabled');
    });
    test('is not set when disabled prop is falsy', () => {
      const { input } = renderInput({ disabled: false });
      expect(input).not.toHaveAttribute('disabled');
    });
    test('can be set', () => {
      const { input } = renderInput({ disabled: true });
      expect(input).toHaveAttribute('disabled');
    });
  });

  describe('readOnly state', () => {
    test('is not set by default', () => {
      const { input } = renderInput();

      expect(input).not.toHaveAttribute('disabled');
      expect(input).not.toHaveClass(styles['input-readonly']);
    });
    test('is not set when readOnly prop is falsy', () => {
      const { input } = renderInput({ readOnly: false });

      expect(input).not.toHaveClass(styles['input-readonly']);
      expect(input).not.toHaveAttribute('readonly');
    });
    test('can be set', () => {
      const { input } = renderInput({ readOnly: true });

      expect(input).toHaveAttribute('readOnly');
      expect(input).toHaveClass(styles['input-readonly']);
    });
  });

  describe('invalid state', () => {
    test('is not set by default', () => {
      const { input } = renderInput();

      expect(input).not.toHaveClass(styles['input-invalid']);
      expect(input).not.toHaveAttribute('aria-invalid');
    });

    test('dis not set when invalid prop is falsy', () => {
      const { input } = renderInput({ invalid: false });
      expect(input).not.toHaveClass(styles['input-invalid']);
      expect(input).not.toHaveAttribute('aria-invalid');
    });

    test('can be set', () => {
      const { input } = renderInput({ invalid: true });
      expect(input).toHaveClass(styles['input-invalid']);
      expect(input).toHaveAttribute('aria-invalid');
    });
  });

  describe('disableBrowserAutocorrect', () => {
    test('does not modify autocorrect features by default', () => {
      const { input } = renderInput();
      expect(input).not.toHaveAttribute('autocorrect');
      expect(input).not.toHaveAttribute('autocapitalize');
    });

    test('does not modify autocorrect features when falsy', () => {
      const { input } = renderInput({ disableBrowserAutocorrect: false });
      expect(input).not.toHaveAttribute('autocorrect');
      expect(input).not.toHaveAttribute('autocapitalize');
    });

    test('can disabled autocorrect features when set', () => {
      const { input } = renderInput({ disableBrowserAutocorrect: true });
      expect(input).toHaveAttribute('autocorrect', 'off');
      expect(input).toHaveAttribute('autocapitalize', 'off');
    });
  });

  describe('autoFocus', () => {
    test('is not set by default', () => {
      const { input } = renderInput();
      expect(input).not.toBe(document.activeElement);
    });

    test('is not set when the property is falsy', () => {
      const { input } = renderInput({ autoFocus: false });
      expect(input).not.toBe(document.activeElement);
    });

    test('focuses the element when set', () => {
      const { input } = renderInput({ autoFocus: true });
      expect(input).toBe(document.activeElement);
    });
  });

  test('controlId can be customized', () => {
    const { input } = renderInput({ controlId: 'something-specific' });
    expect(input).toHaveAttribute('id', 'something-specific');
  });

  describe('ARIA', () => {
    describe('aria-label', () => {
      test('is not added if not defined', () => {
        const { input } = renderInput();
        expect(input).not.toHaveAttribute('aria-label');
      });
      test('can be set to custom value', () => {
        const { input } = renderInput({ ariaLabel: 'my-custom-label' });
        expect(input).toHaveAttribute('aria-label', 'my-custom-label');
      });
    });

    describe('aria-describedby', () => {
      test('is not added if set to null', () => {
        const { input } = renderInput();
        expect(input).not.toHaveAttribute('aria-describedby');
      });
      test('can be set to custom value', () => {
        const { input } = renderInput({ ariaDescribedby: 'my-custom-id' });
        expect(input).toHaveAttribute('aria-describedby', 'my-custom-id');
      });
      test('can be customized without controlId', () => {
        const { input } = renderInput({ controlId: undefined, ariaDescribedby: 'my-custom-id' });

        expect(input).toHaveAttribute('aria-describedby', 'my-custom-id');
      });
    });

    describe('aria-labelledby', () => {
      test('is not added if not defined', () => {
        const { input } = renderInput();
        expect(input).not.toHaveAttribute('aria-labelledby');
      });
      test('can be set to custom value', () => {
        const { input } = renderInput({ ariaLabelledby: 'my-custom-id' });
        expect(input).toHaveAttribute('aria-labelledby', 'my-custom-id');
      });
    });

    describe('aria-required', () => {
      test('is added to native input if ariaRequired is passed', () => {
        const { input } = renderInput({ ariaRequired: true, ariaLabel: 'input' });
        expect(input).toHaveAttribute('aria-required', 'true');
      });
      test('is not added to native input if ariaRequired is not passed', () => {
        const { input } = renderInput({ ariaLabel: 'input' });
        expect(input).not.toHaveAttribute('aria-required');
      });
      test('is not added to native input if ariaRequired is falsy', () => {
        const { input } = renderInput({ ariaRequired: false, ariaLabel: 'input' });
        expect(input).not.toHaveAttribute('aria-required');
      });
    });

    test('aria-label from input takes precedence over aria-labelledBy from form field', () => {
      render(
        <FormField label="Form label">
          <Input value="" ariaLabel="Input label" />
        </FormField>
      );

      const element = createWrapper().find('input')!.getElement();

      expect(element).toHaveAttribute('aria-label', 'Input label');
      expect(element).not.toHaveAttribute('aria-labelledby');
    });
  });

  describe('Ref', () => {
    test('can be used to focus the component', () => {
      const ref = React.createRef<InputProps.Ref>();
      const { input } = renderInput({ ref });
      expect(document.activeElement).not.toBe(input);
      ref.current!.focus();
      expect(document.activeElement).toBe(input);
    });

    test('can be used to select all text', () => {
      const ref = React.createRef<InputProps.Ref>();
      const { input } = renderInput({ ref, value: 'Test' });

      // Make sure no text is selected
      input.selectionStart = input.selectionEnd = 0;
      input.blur();
      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe(0);

      // Select all text
      ref.current!.select();
      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe(4);
    });
  });

  describe('Event handlers', () => {
    test('onFocus is called when component is focused', () => {
      const focusSpy = jest.fn();
      const { input } = renderInput({ onFocus: focusSpy });
      expect(focusSpy).not.toHaveBeenCalled();
      input.focus();
      expect(focusSpy).toHaveBeenCalled();
    });

    test('onBlur is called when component is blurred', () => {
      const blurSpy = jest.fn();
      const { input } = renderInput({ onBlur: blurSpy });
      input.focus();
      expect(blurSpy).not.toHaveBeenCalled();
      input.blur();
      expect(blurSpy).toHaveBeenCalled();
    });

    test('onChange is called with correct details', () => {
      const changeSpy = jest.fn();
      const { wrapper } = renderInput({ onChange: changeSpy });
      expect(changeSpy).not.toHaveBeenCalled();

      wrapper.setInputValue('ac');
      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect(changeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { value: 'ac' },
        })
      );
    });

    test('onKeyDown is called with correct details', () => {
      const keyDownSpy = jest.fn(function (event: any) {
        expect(event.detail).toEqual({
          keyCode: 65,
          key: 'A',
          shiftKey: true,
          ctrlKey: false,
          altKey: false,
          metaKey: false,
        });
      });
      const { input } = renderInput({ onKeyDown: keyDownSpy });
      expect(keyDownSpy).not.toHaveBeenCalled();

      fireEvent.keyDown(input, { keyCode: 65, key: 'A', shiftKey: true });
      expect(keyDownSpy).toHaveBeenCalledTimes(1);
    });

    test('onKeyUp is called with correct details', () => {
      const keyUpSpy = jest.fn(function (event: any) {
        expect(event.detail).toEqual({
          keyCode: 65,
          key: 'A',
          shiftKey: true,
          ctrlKey: false,
          altKey: false,
          metaKey: false,
        });
      });
      const { input } = renderInput({ onKeyUp: keyUpSpy });
      expect(keyUpSpy).not.toHaveBeenCalled();

      fireEvent.keyUp(input, { keyCode: 65, key: 'A', shiftKey: true });
      expect(keyUpSpy).toHaveBeenCalledTimes(1);
    });
  });

  test('input is blurred when type=number and scrolled over', () => {
    const blurSpy = jest.fn();
    const { wrapper, input } = renderInput({ type: 'number', onBlur: blurSpy });
    wrapper.focus();
    expect(blurSpy).not.toHaveBeenCalled();
    fireEvent.wheel(input);
    expect(blurSpy).toHaveBeenCalledTimes(1);
  });
});
