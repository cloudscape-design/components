// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Textarea, { TextareaProps } from '../../../lib/components/textarea';
import styles from '../../../lib/components/textarea/styles.css.js';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderTextarea(
  props: Omit<TextareaProps, 'value'> & { value?: string } & React.RefAttributes<HTMLTextAreaElement> = {}
) {
  const { container } = render(<Textarea value="" onChange={() => {}} {...props} />);
  const textareaWrapper = createWrapper(container).findTextarea()!;

  return {
    textarea: textareaWrapper.findNativeTextarea().getElement(),
    textareaWrapper,
  };
}
describe('Textarea', () => {
  test('does not pass unknown props to the internal native textarea', () => {
    const { textarea } = renderTextarea({
      min: 0,
    } as any);

    expect(textarea).not.toHaveAttribute('min');
  });

  describe('value', () => {
    test('can be set', () => {
      const { textarea } = renderTextarea({ value: 'value' });
      expect(textarea).toHaveTextContent('value');
    });
    test('can be obtained through getTextareaValue API', () => {
      const { textareaWrapper } = renderTextarea({ value: 'value' });
      expect(textareaWrapper.getTextareaValue()).toBe('value');
    });
  });

  describe('placeholder', () => {
    test('is not set by default', () => {
      const { textarea } = renderTextarea();
      expect(textarea).not.toHaveAttribute('placeholder');
    });
    test('can be set', () => {
      const { textarea } = renderTextarea({ placeholder: 'placeholder' });
      expect(textarea).toHaveAttribute('placeholder', 'placeholder');
    });
  });

  describe('name', () => {
    test('is not set by default', () => {
      const { textarea } = renderTextarea();
      expect(textarea).not.toHaveAttribute('name');
    });
    test('can be set', () => {
      const { textarea } = renderTextarea({ name: 'name' });
      expect(textarea).toHaveAttribute('name', 'name');
    });
  });

  describe('autocomplete', () => {
    test('is enabled by default', () => {
      const { textarea } = renderTextarea();
      expect(textarea).toHaveAttribute('autocomplete', 'on');
    });

    test('can be disabled', () => {
      const { textarea } = renderTextarea({ autoComplete: false });

      expect(textarea).toHaveAttribute('autocomplete', 'off');
    });

    test('can have custom string values', () => {
      const { textarea } = renderTextarea({ autoComplete: 'new-password' });
      expect(textarea).toHaveAttribute('autocomplete', 'new-password');
    });

    test('can be disabled with custom string value', () => {
      const { textarea } = renderTextarea({ autoComplete: 'off' });
      expect(textarea).toHaveAttribute('autocomplete', 'off');
    });
  });

  describe('disabled state', () => {
    test('is not set by default', () => {
      const { textarea } = renderTextarea();
      expect(textarea).not.toHaveAttribute('disabled');
    });
    test('is not set when disabled prop is falsy', () => {
      const { textarea } = renderTextarea({ disabled: false });
      expect(textarea).not.toHaveAttribute('disabled');
    });
    test('can be set', () => {
      const { textarea } = renderTextarea({ disabled: true });
      expect(textarea).toHaveAttribute('disabled');
    });
  });

  describe('readOnly state', () => {
    test('is not set by default', () => {
      const { textarea } = renderTextarea();

      expect(textarea).not.toHaveAttribute('disabled');
      expect(textarea).not.toHaveClass(styles['textarea-readonly']);
    });
    test('is not set when readOnly prop is falsy', () => {
      const { textarea } = renderTextarea({ readOnly: false });

      expect(textarea).not.toHaveClass(styles['textarea-readonly']);
      expect(textarea).not.toHaveAttribute('readonly');
    });
    test('can be set', () => {
      const { textarea } = renderTextarea({ readOnly: true });

      expect(textarea).toHaveAttribute('readOnly');
      expect(textarea).toHaveClass(styles['textarea-readonly']);
    });
  });

  describe('invalid state', () => {
    test('is not set by default', () => {
      const { textarea } = renderTextarea();

      expect(textarea).not.toHaveClass(styles['textarea-invalid']);
      expect(textarea).not.toHaveAttribute('aria-invalid');
    });

    test('is not set when invalid prop is falsy', () => {
      const { textarea } = renderTextarea({ invalid: false });
      expect(textarea).not.toHaveClass(styles['textarea-invalid']);
      expect(textarea).not.toHaveAttribute('aria-invalid');
    });

    test('can be set', () => {
      const { textarea } = renderTextarea({ invalid: true });
      expect(textarea).toHaveClass(styles['textarea-invalid']);
      expect(textarea).toHaveAttribute('aria-invalid');
    });
  });

  describe('warning state', () => {
    test('is not set by default', () => {
      const { textarea } = renderTextarea();

      expect(textarea).not.toHaveClass(styles['textarea-warning']);
    });

    test('is not set when warning prop is falsy', () => {
      const { textarea } = renderTextarea({ warning: false });
      expect(textarea).not.toHaveClass(styles['textarea-warning']);
    });

    test('can be set', () => {
      const { textarea } = renderTextarea({ warning: true });
      expect(textarea).toHaveClass(styles['textarea-warning']);
    });

    test('is overriden when invalid is true', () => {
      const { textarea } = renderTextarea({ warning: true, invalid: true });
      expect(textarea).not.toHaveClass(styles['textarea-warning']);
      expect(textarea).toHaveClass(styles['textarea-invalid']);
      expect(textarea).toHaveAttribute('aria-invalid');
    });
  });

  describe('disableBrowserAutocorrect', () => {
    test('does not modify autocorrect features by default', () => {
      const { textarea } = renderTextarea();
      expect(textarea).not.toHaveAttribute('autocorrect');
      expect(textarea).not.toHaveAttribute('autocapitalize');
    });

    test('does not modify autocorrect features when falsy', () => {
      const { textarea } = renderTextarea({ disableBrowserAutocorrect: false });
      expect(textarea).not.toHaveAttribute('autocorrect');
      expect(textarea).not.toHaveAttribute('autocapitalize');
    });

    test('can disabled autocorrect features when set', () => {
      const { textarea } = renderTextarea({ disableBrowserAutocorrect: true });
      expect(textarea).toHaveAttribute('autocorrect', 'off');
      expect(textarea).toHaveAttribute('autocapitalize', 'off');
    });
  });

  describe('disableBrowserSpellcheck', () => {
    test('does not modify spellcheck default', () => {
      const { textarea } = renderTextarea();
      expect(textarea).not.toHaveAttribute('spellcheck');
    });

    test('does not modify spellcheck when falsy', () => {
      const { textarea } = renderTextarea({ disableBrowserSpellcheck: false });
      expect(textarea).not.toHaveAttribute('spellcheck');
    });

    test('can disable spellcheck when set', () => {
      const { textarea } = renderTextarea({ disableBrowserSpellcheck: true });
      expect(textarea).toHaveAttribute('spellcheck', 'false');
    });
  });

  describe('spellcheck', () => {
    test('keeps default behavior if not set', () => {
      const { textarea } = renderTextarea();
      expect(textarea).not.toHaveAttribute('spellcheck');
    });

    test('can explicitly activate spellchecking', () => {
      const { textarea } = renderTextarea({ spellcheck: true });
      expect(textarea).toHaveAttribute('spellcheck', 'true');
    });

    test('can explicitly deactivate spellchecking', () => {
      const { textarea } = renderTextarea({ spellcheck: false });
      expect(textarea).toHaveAttribute('spellcheck', 'false');
    });
  });

  describe('autoFocus', () => {
    test('is not set by default', () => {
      const { textarea } = renderTextarea();
      expect(textarea).not.toBe(document.activeElement);
    });

    test('is not set when the propperty is falsy', () => {
      const { textarea } = renderTextarea({ autoFocus: false });
      expect(textarea).not.toBe(document.activeElement);
    });

    test('focuses the element when set', () => {
      const { textarea } = renderTextarea({ autoFocus: true });
      expect(textarea).toBe(document.activeElement);
    });
  });

  describe('rows', function () {
    test('is set to 3 by default', () => {
      const { textarea } = renderTextarea();
      expect(textarea.rows).toBe(3);
    });
    test('can be set', () => {
      const { textarea } = renderTextarea({ rows: 5 });
      expect(textarea.rows).toBe(5);
    });
  });

  describe('id and controlId', () => {
    test('id is rendered on the outer tag', () => {
      const { textareaWrapper } = renderTextarea({ id: 'something-specific' });

      expect(textareaWrapper.getElement()).toHaveAttribute('id', 'something-specific');
      expect(textareaWrapper.findNativeTextarea().getElement()).not.toHaveAttribute('id');
    });

    test('controlId is passed to the native textarea', () => {
      const { textareaWrapper } = renderTextarea({ controlId: 'something-specific' });

      expect(textareaWrapper.getElement()).not.toHaveAttribute('id');
      expect(textareaWrapper.findNativeTextarea().getElement()).toHaveAttribute('id', 'something-specific');
    });

    test('controlId and id are both rendered when set', () => {
      const id = 'some-id';
      const controlId = 'some-control-id';
      const { textareaWrapper } = renderTextarea({ id, controlId });

      expect(textareaWrapper.getElement()).toHaveAttribute('id', id);
      expect(textareaWrapper.findNativeTextarea().getElement()).toHaveAttribute('id', controlId);
    });
  });

  describe('ARIA', () => {
    describe('aria-label', () => {
      test('is not added if not defined', () => {
        const { textarea } = renderTextarea();
        expect(textarea).not.toHaveAttribute('aria-label');
      });
      test('can be set to custom value', () => {
        const { textarea } = renderTextarea({ ariaLabel: 'my-custom-label' });
        expect(textarea).toHaveAttribute('aria-label', 'my-custom-label');
      });
    });

    describe('aria-describedby', () => {
      test('is not added if set to null', () => {
        const { textarea } = renderTextarea();
        expect(textarea).not.toHaveAttribute('aria-describedby');
      });
      test('can be set to custom value', () => {
        const { textarea } = renderTextarea({ ariaDescribedby: 'my-custom-id' });
        expect(textarea).toHaveAttribute('aria-describedby', 'my-custom-id');
      });
      test('can be customized without controlId', () => {
        const { textarea } = renderTextarea({ id: undefined, ariaDescribedby: 'my-custom-id' });

        expect(textarea).toHaveAttribute('aria-describedby', 'my-custom-id');
      });
    });

    describe('aria-labelledby', () => {
      test('is not added if not defined', () => {
        const { textarea } = renderTextarea();
        expect(textarea).not.toHaveAttribute('aria-labelledby');
      });
      test('can be set to custom value', () => {
        const { textarea } = renderTextarea({ ariaLabelledby: 'my-custom-id' });
        expect(textarea).toHaveAttribute('aria-labelledby', 'my-custom-id');
      });
    });

    describe('aria-required', () => {
      test('is added to native textarea if ariaRequired is passed', () => {
        const { textarea } = renderTextarea({ ariaRequired: true, ariaLabel: 'textarea' });
        expect(textarea).toHaveAttribute('aria-required', 'true');
      });
      test('is not added to native textarea if ariaRequired is not passed', () => {
        const { textarea } = renderTextarea({ ariaLabel: 'textarea' });
        expect(textarea).not.toHaveAttribute('aria-required');
      });
      test('is not added to native textarea if ariaRequired is falsy', () => {
        const { textarea } = renderTextarea({ ariaRequired: false, ariaLabel: 'textarea' });
        expect(textarea).not.toHaveAttribute('aria-required');
      });
    });
  });

  describe('Ref', () => {
    test('can be used to focus the component', () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      const { textarea } = renderTextarea({ ref });
      expect(document.activeElement).not.toBe(textarea);
      ref.current?.focus();
      expect(document.activeElement).toBe(textarea);
    });
  });

  describe('Event handlers', () => {
    test('onFocus is called when component is focused', () => {
      const focusSpy = jest.fn();
      const { textarea } = renderTextarea({ onFocus: focusSpy });
      expect(focusSpy).not.toHaveBeenCalled();
      textarea.focus();
      expect(focusSpy).toHaveBeenCalled();
    });

    test('onBlur is called when component is blurred', () => {
      const blurSpy = jest.fn();
      const { textarea } = renderTextarea({ onBlur: blurSpy });
      textarea.focus();
      expect(blurSpy).not.toHaveBeenCalled();
      textarea.blur();
      expect(blurSpy).toHaveBeenCalled();
    });

    test('onChange is called with correct details', () => {
      const changeSpy = jest.fn(function (event: any) {
        expect(event.detail).toEqual({
          value: 'ac',
        });
      });
      const { textareaWrapper } = renderTextarea({ onChange: changeSpy });
      expect(changeSpy).not.toHaveBeenCalled();

      textareaWrapper.setTextareaValue('ac');
      expect(changeSpy).toHaveBeenCalledTimes(1);
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
      const { textarea } = renderTextarea({ onKeyDown: keyDownSpy });
      expect(keyDownSpy).not.toHaveBeenCalled();

      fireEvent.keyDown(textarea, { keyCode: 65, key: 'A', shiftKey: true });
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
      const { textarea } = renderTextarea({ onKeyUp: keyUpSpy });
      expect(keyUpSpy).not.toHaveBeenCalled();

      fireEvent.keyUp(textarea, { keyCode: 65, key: 'A', shiftKey: true });
      expect(keyUpSpy).toHaveBeenCalledTimes(1);
    });
  });
});
