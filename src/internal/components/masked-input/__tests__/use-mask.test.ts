// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { RefObject } from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { renderHook } from '../../../../__tests__/render-hook.js';
import { InputProps } from '../../../../input/interfaces.js';
import { BaseKeyDetail } from '../../../events/index.js';
import { KeyCode } from '../../../keycode.js';
import useMask, { UseMaskProps } from '../use-mask.js';
import MaskFormat from '../utils/mask-format.js';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

function createChangeEvent(value: string) {
  return { detail: { value } } as unknown as CustomEvent<InputProps.ChangeDetail>;
}

function createKeyDownEvent(detail: Partial<BaseKeyDetail>) {
  return { detail, preventDefault: jest.fn() } as unknown as CustomEvent<InputProps.KeyDetail>;
}

function createBlurEvent() {
  return null as unknown as CustomEvent<null>;
}

function createClipboardEvent(value: string) {
  const clipboardData = {
    getData: jest.fn().mockReturnValue(value),
  };
  return { clipboardData } as unknown as React.ClipboardEvent;
}

describe('useMask', () => {
  const setup = (props: Partial<UseMaskProps> = {}) => {
    // Create a simple time format (HH:MM) for testing
    const createTimeFormat = jest.fn().mockReturnValue(
      new MaskFormat({
        separator: ':',
        segments: [
          { min: 0, max: 23, length: 2 },
          { min: 0, max: 59, length: 2 },
        ],
      })
    );
    const format = createTimeFormat();
    const onChange = jest.fn();
    const onKeyDown = jest.fn();
    const onBlur = jest.fn();
    const inputRef = { current: { selectionStart: 0, selectionEnd: 0 } } as RefObject<HTMLInputElement>;
    const setPosition = jest.fn();
    const { result } = renderHook(() =>
      useMask({ value: '', onChange, onKeyDown, onBlur, format, inputRef, setPosition, ...props })
    );
    return {
      result,
      format,
      inputRef,
      mockOnBlur: onBlur,
      mockOnChange: onChange,
      mockOnKeyDown: onKeyDown,
      mockSetPosition: setPosition,
      mockCreateTimeFormat: createTimeFormat,
    };
  };

  describe('initialization', () => {
    it('should return the initial value', () => {
      const { result } = setup({ value: '12:34' });
      expect(result.current.value).toBe('12:34');
    });

    it('should correct the initial value if autofix is true', () => {
      const { result, mockCreateTimeFormat } = setup({ value: '25:70', autofix: true });
      expect(result.current.value).toBe('23:59');
      expect(mockCreateTimeFormat).toHaveBeenCalled();
    });

    it('should not correct the initial value if autofix is false', () => {
      const { result, mockCreateTimeFormat } = setup({ value: '25:70', autofix: false });
      expect(result.current.value).toBe('2');
      expect(mockCreateTimeFormat).toHaveBeenCalled();
    });

    it('should warn if the initial value is invalid', () => {
      setup({ value: 'invalid' });
      expect(warnOnce).toHaveBeenCalledWith('useMask', 'Invalid string "invalid" provided');
    });

    it('should return a valid value even if the initial value is invalid', () => {
      const { result } = setup({ value: 'invalid' });
      expect(result.current.value).toBe('');
    });
  });

  describe('onChange handler', () => {
    it('should call onChange with the updated value', () => {
      const { result, mockOnChange } = setup();
      result.current.onChange(createChangeEvent('12:34'));
      expect(mockOnChange).toHaveBeenCalledWith('12:34');
    });

    it('should not call onChange if the value is invalid', () => {
      const { result, mockOnChange } = setup();
      result.current.onChange(createChangeEvent('invalid'));
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should not call onChange if the value is the same', () => {
      const { result, mockOnChange } = setup({ value: '12:34' });
      result.current.onChange(createChangeEvent('12:34'));
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should autofix the value if autofix is true', () => {
      const { result, mockOnChange } = setup({ autofix: true });
      result.current.onChange(createChangeEvent('25:70'));
      expect(mockOnChange).toHaveBeenCalledWith('23:59');
    });

    it('should not call onChange if the value is out of bounds and autofix is false', () => {
      const { result, mockOnChange } = setup({ autofix: false });
      result.current.onChange(createChangeEvent('25:70'));
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('onKeyDown handler', () => {
    it('should handle digit keys', () => {
      const { result, inputRef, mockOnChange, mockSetPosition } = setup();
      inputRef.current!.selectionStart = 0;
      inputRef.current!.selectionEnd = 0;
      result.current.onKeyDown(createKeyDownEvent({ key: '1', keyCode: 49, ctrlKey: false, metaKey: false }));
      expect(mockOnChange).toHaveBeenCalledWith('1');
      expect(mockSetPosition).toHaveBeenCalledWith(1);
    });

    it('should handle backspace key', () => {
      const { result, mockOnChange, inputRef, mockSetPosition } = setup({ value: '12:34' });
      inputRef.current!.selectionStart = 3;
      inputRef.current!.selectionEnd = 3;
      result.current.onKeyDown(createKeyDownEvent({ keyCode: KeyCode.backspace, ctrlKey: false, metaKey: false }));
      expect(mockOnChange).toHaveBeenCalled();
      expect(mockSetPosition).toHaveBeenCalled();
    });

    it('should handle enter key for auto-completion', () => {
      const { result, mockOnChange, inputRef, mockSetPosition } = setup({ value: '12:3' });
      inputRef.current!.selectionStart = 4;
      inputRef.current!.selectionEnd = 4;
      result.current.onKeyDown(createKeyDownEvent({ keyCode: KeyCode.enter, ctrlKey: false, metaKey: false }));
      expect(mockOnChange).toHaveBeenCalledWith('12:03');
      expect(mockSetPosition).toHaveBeenCalledWith(5);
    });

    it('should prevent default for non-command keys', () => {
      const { result } = setup();
      const event = createKeyDownEvent({ key: 'a', keyCode: 65, ctrlKey: false, metaKey: false });
      result.current.onKeyDown(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not prevent default for command keys', () => {
      const { result } = setup();
      const event = createKeyDownEvent({ keyCode: KeyCode.tab, ctrlKey: false, metaKey: false });
      result.current.onKeyDown(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should call the original onKeyDown handler', () => {
      const { result, mockOnKeyDown } = setup();
      const event = createKeyDownEvent({ key: '1', keyCode: 49, ctrlKey: false, metaKey: false });
      result.current.onKeyDown(event);
      expect(mockOnKeyDown).toHaveBeenCalledWith(event);
    });
  });

  describe('onBlur handler', () => {
    it('should auto-complete the value on blur', () => {
      const { result, mockOnChange, mockOnBlur } = setup({ value: '12:3' });
      result.current.onBlur(createBlurEvent());
      expect(mockOnChange).toHaveBeenCalledWith('12:03');
      expect(mockOnBlur).toHaveBeenCalled();
    });

    it('should not auto-complete if disableAutocompleteOnBlur is true', () => {
      const { result, mockOnChange, mockOnBlur } = setup({ value: '12:3', disableAutocompleteOnBlur: true });
      result.current.onBlur(createBlurEvent());
      expect(mockOnChange).not.toHaveBeenCalled();
      expect(mockOnBlur).toHaveBeenCalled();
    });

    it('should not auto-complete if the value is empty', () => {
      const { result, mockOnChange } = setup({ value: '' });
      result.current.onBlur(createBlurEvent());
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('onPaste handler', () => {
    it('should handle pasted text', () => {
      const { result, mockOnChange } = setup();
      result.current.onPaste(createClipboardEvent('1234'));
      expect(mockOnChange).toHaveBeenCalledWith('12:34');
    });

    it('should handle pasted text with selection range', () => {
      const { result, mockOnChange, inputRef } = setup({ value: '12:34' });
      inputRef.current!.selectionStart = 0;
      inputRef.current!.selectionEnd = 5;
      result.current.onPaste(createClipboardEvent('0959'));
      expect(mockOnChange).toHaveBeenCalledWith('09:59');
    });

    it('should handle pasted text with separators', () => {
      const { result, mockOnChange } = setup();
      result.current.onPaste(createClipboardEvent('12:34'));
      expect(mockOnChange).toHaveBeenCalledWith('12:34');
    });
  });
});
