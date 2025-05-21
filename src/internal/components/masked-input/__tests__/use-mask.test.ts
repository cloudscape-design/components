// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject } from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { renderHook } from '../../../../__tests__/render-hook';
import { InputProps } from '../../../../input/interfaces';
import { BaseKeyDetail } from '../../../events';
import { KeyCode } from '../../../keycode';
import useMask, { UseMaskProps } from '../use-mask';
import MaskFormat from '../utils/mask-format';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

// Define types for our tests
interface TestCustomEvent<T> {
  detail: T;
  preventDefault: jest.Mock;
}

interface TestChangeEvent {
  detail: { value: string };
}

interface TestClipboardEvent {
  clipboardData?: {
    getData: jest.Mock<string, [string]>;
  };
}

describe('useMask', () => {
  const timeMask = new MaskFormat({
    separator: ':',
    segments: [
      { min: 0, max: 23, length: 2 },
      { min: 0, max: 59, length: 2 },
    ],
  });
  // Create a simple time format (HH:MM) for testing
  const mockCreateTimeFormat = jest.fn().mockReturnValue(timeMask);

  const setup = (props: Partial<UseMaskProps> = {}) => {
    const format = mockCreateTimeFormat();
    const mockOnChange = jest.fn();
    const mockOnKeyDown = jest.fn();
    const mockOnBlur = jest.fn();
    const inputRef = { current: { selectionStart: 0, selectionEnd: 0 } } as RefObject<HTMLInputElement>;
    const mockSetPosition = jest.fn();

    const defaultProps: UseMaskProps = {
      value: '',
      onChange: mockOnChange,
      onKeyDown: mockOnKeyDown,
      onBlur: mockOnBlur,
      format,
      inputRef,
      setPosition: mockSetPosition,
    };

    const { result } = renderHook(() => useMask({ ...defaultProps, ...props }));
    return {
      result,
      inputRef,
      format,
      mockOnBlur,
      mockOnChange,
      mockOnKeyDown,
      mockSetPosition,
    };
  };

  describe('initialization', () => {
    it('should return the initial value', () => {
      const { result } = setup({ value: '12:34' });
      expect(result.current.value).toBe('12:34');
    });

    it('should correct the initial value if autofix is true', () => {
      const { result } = setup({ value: '25:70', autofix: true });
      expect(result.current.value).toBe('23:59');
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
      const event: TestChangeEvent = { detail: { value: '12:34' } };
      result.current.onChange(event as unknown as CustomEvent<InputProps.ChangeDetail>);
      expect(mockOnChange).toHaveBeenCalledWith('12:34');
    });

    it('should not call onChange if the value is invalid', () => {
      const { result, mockOnChange } = setup();
      const event: TestChangeEvent = { detail: { value: 'invalid' } };
      result.current.onChange(event as unknown as CustomEvent<InputProps.ChangeDetail>);
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should not call onChange if the value is the same', () => {
      const { result, mockOnChange } = setup({ value: '12:34' });
      const event: TestChangeEvent = { detail: { value: '12:34' } };
      result.current.onChange(event as unknown as CustomEvent<InputProps.ChangeDetail>);
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should autofix the value if autofix is true', () => {
      const { result, mockOnChange } = setup({ autofix: true });
      const event: TestChangeEvent = { detail: { value: '25:70' } };
      result.current.onChange(event as unknown as CustomEvent<InputProps.ChangeDetail>);
      expect(mockOnChange).toHaveBeenCalledWith('23:59');
    });
  });

  describe('onKeyDown handler', () => {
    it('should handle digit keys', () => {
      const { result, mockOnChange, inputRef, mockSetPosition } = setup();
      inputRef.current!.selectionStart = 0;
      inputRef.current!.selectionEnd = 0;

      const event: TestCustomEvent<InputProps.KeyDetail> = {
        detail: { key: '1', keyCode: 49, ctrlKey: false, metaKey: false } as BaseKeyDetail,
        preventDefault: jest.fn(),
      };

      result.current.onKeyDown(event as unknown as CustomEvent<InputProps.KeyDetail>);

      expect(mockOnChange).toHaveBeenCalledWith('1');
      expect(mockSetPosition).toHaveBeenCalledWith(1);
    });

    it('should handle backspace key', () => {
      const { result, mockOnChange, inputRef, mockSetPosition } = setup({ value: '12:34' });
      inputRef.current!.selectionStart = 3;
      inputRef.current!.selectionEnd = 3;

      const event: TestCustomEvent<InputProps.KeyDetail> = {
        detail: { keyCode: KeyCode.backspace, ctrlKey: false, metaKey: false } as BaseKeyDetail,
        preventDefault: jest.fn(),
      };

      result.current.onKeyDown(event as unknown as CustomEvent<InputProps.KeyDetail>);

      expect(mockOnChange).toHaveBeenCalled();
      expect(mockSetPosition).toHaveBeenCalled();
    });

    it('should handle enter key for auto-completion', () => {
      const { result, mockOnChange, inputRef, mockSetPosition } = setup({ value: '12:3' });
      inputRef.current!.selectionStart = 4;
      inputRef.current!.selectionEnd = 4;

      const event: TestCustomEvent<InputProps.KeyDetail> = {
        detail: { keyCode: KeyCode.enter, ctrlKey: false, metaKey: false } as BaseKeyDetail,
        preventDefault: jest.fn(),
      };

      result.current.onKeyDown(event as unknown as CustomEvent<InputProps.KeyDetail>);

      expect(mockOnChange).toHaveBeenCalledWith('12:03');
      expect(mockSetPosition).toHaveBeenCalledWith(5);
    });

    it('should prevent default for non-command keys', () => {
      const { result } = setup();
      const preventDefault = jest.fn();

      const event: TestCustomEvent<InputProps.KeyDetail> = {
        detail: { key: 'a', keyCode: 65, ctrlKey: false, metaKey: false } as BaseKeyDetail,
        preventDefault,
      };

      result.current.onKeyDown(event as unknown as CustomEvent<InputProps.KeyDetail>);

      expect(preventDefault).toHaveBeenCalled();
    });

    it('should not prevent default for command keys', () => {
      const { result } = setup();
      const preventDefault = jest.fn();

      const event: TestCustomEvent<InputProps.KeyDetail> = {
        detail: { keyCode: KeyCode.tab, ctrlKey: false, metaKey: false } as BaseKeyDetail,
        preventDefault,
      };

      result.current.onKeyDown(event as unknown as CustomEvent<InputProps.KeyDetail>);

      expect(preventDefault).not.toHaveBeenCalled();
    });

    it('should call the original onKeyDown handler', () => {
      const { result, mockOnKeyDown } = setup();
      const event: TestCustomEvent<InputProps.KeyDetail> = {
        detail: { key: '1', keyCode: 49, ctrlKey: false, metaKey: false } as BaseKeyDetail,
        preventDefault: jest.fn(),
      };

      result.current.onKeyDown(event as unknown as CustomEvent<InputProps.KeyDetail>);

      expect(mockOnKeyDown).toHaveBeenCalledWith(event);
    });
  });

  describe('onBlur handler', () => {
    it('should auto-complete the value on blur', () => {
      const { result, mockOnChange, mockOnBlur } = setup({ value: '12:3' });

      result.current.onBlur(null as unknown as CustomEvent<null>);

      expect(mockOnChange).toHaveBeenCalledWith('12:03');
      expect(mockOnBlur).toHaveBeenCalled();
    });

    it('should not auto-complete if disableAutocompleteOnBlur is true', () => {
      const { result, mockOnChange, mockOnBlur } = setup({ value: '12:3', disableAutocompleteOnBlur: true });

      result.current.onBlur(null as unknown as CustomEvent<null>);

      expect(mockOnChange).not.toHaveBeenCalled();
      expect(mockOnBlur).toHaveBeenCalled();
    });

    it('should not auto-complete if the value is empty', () => {
      const { result, mockOnChange } = setup({ value: '' });

      result.current.onBlur(null as unknown as CustomEvent<null>);

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('onPaste handler', () => {
    it('should handle pasted text', () => {
      const { result, mockOnChange } = setup();
      const clipboardData = {
        getData: jest.fn().mockReturnValue('1234'),
      };

      const event: TestClipboardEvent = { clipboardData };
      result.current.onPaste(event as unknown as React.ClipboardEvent);

      expect(mockOnChange).toHaveBeenCalledWith('12:34');
    });

    it('should handle pasted text with selection range', () => {
      const { result, mockOnChange, inputRef } = setup({ value: '12:34' });
      inputRef.current!.selectionStart = 0;
      inputRef.current!.selectionEnd = 5;

      const clipboardData = {
        getData: jest.fn().mockReturnValue('0959'),
      };

      const event: TestClipboardEvent = { clipboardData };
      result.current.onPaste(event as unknown as React.ClipboardEvent);

      expect(mockOnChange).toHaveBeenCalledWith('09:59');
    });

    it('should handle pasted text with separators', () => {
      const { result, mockOnChange } = setup();
      const clipboardData = {
        getData: jest.fn().mockReturnValue('12:34'),
      };

      const event: TestClipboardEvent = { clipboardData };
      result.current.onPaste(event as unknown as React.ClipboardEvent);

      expect(mockOnChange).toHaveBeenCalledWith('12:34');
    });

    it.skip('should use window.clipboardData if event.clipboardData is not available', () => {
      const { result, mockOnChange } = setup();
      const windowClipboardData = {
        getData: jest.fn().mockReturnValue('1234'),
      };

      // Save original window object
      const originalWindow = global.window;

      // Mock window.clipboardData
      global.window = { ...originalWindow, clipboardData: windowClipboardData } as unknown as Window &
        typeof globalThis;

      const event: TestClipboardEvent = {};
      result.current.onPaste(event as unknown as React.ClipboardEvent);

      expect(windowClipboardData.getData).toHaveBeenCalledWith('text');
      expect(mockOnChange).toHaveBeenCalledWith('12:34');

      // Restore original window object
      global.window = originalWindow;
    });
  });
});
