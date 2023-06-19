// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject } from 'react';
import { InputProps } from '../../../input/interfaces';
import { NonCancelableEventHandler, CancelableEventHandler } from '../../events';
import { KeyCode } from '../../keycode';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { isCommand, isDigit } from './utils/keys';

import MaskFormat from './utils/mask-format';
import { backspaceHandler, HandlerResult, keyHandler, enterHandler } from './keyboard-handler';

interface UseMaskHook {
  value: string;
  onChange: NonCancelableEventHandler<InputProps.ChangeDetail>;
  onKeyDown: CancelableEventHandler<InputProps.KeyDetail>;
  onBlur: NonCancelableEventHandler<null>;
  onPaste: (event: ClipboardEvent) => void;
}

interface UseMaskProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: CustomEvent) => void;
  onBlur?: () => void;
  format: MaskFormat;
  autofix?: boolean;
  inputRef: RefObject<HTMLInputElement>;
  disableAutocompleteOnBlur?: boolean;
  setPosition: (position: number | null) => void;
}

const onAutoComplete = (value: string, onChange: UseMaskProps['onChange'], maskFormat: MaskFormat) => {
  // Do not autocomplete if input is empty
  if (!value) {
    return;
  }

  const autoCompletedValue = maskFormat.autoComplete(value);
  if (autoCompletedValue !== value) {
    onChange(autoCompletedValue);
  }
};

const preventDefault = (event: CustomEvent, result?: HandlerResult | null) => result && event.preventDefault();

const useMask = ({
  value = '',
  onBlur,
  onChange,
  onKeyDown,
  format,
  inputRef,
  autofix = false,
  disableAutocompleteOnBlur = false,
  setPosition,
}: UseMaskProps): UseMaskHook => {
  if (!format.isValid(value)) {
    warnOnce('useMask', `Invalid string "${value}" provided`);
  }

  const onMaskChange = (updatedValue: string) => {
    const autofixedUpdatedValue = autofix ? format.correctMinMaxValues(updatedValue) : updatedValue;
    if (autofixedUpdatedValue === value || !format.isValid(autofixedUpdatedValue)) {
      return;
    }

    onChange(autofixedUpdatedValue);
  };

  const initialValue = autofix ? format.correctMinMaxValues(value) : value;
  const maskedValue = format.getValidValue(initialValue);

  return {
    value: maskedValue,
    onKeyDown: (event: CustomEvent) => {
      const selectionStart = inputRef.current?.selectionStart || 0;
      const selectionEnd = inputRef.current?.selectionEnd || 0;

      let result: HandlerResult | undefined;
      const { keyCode, key, ctrlKey, metaKey } = event.detail;
      if (isDigit(key) || format.isSeparator(key)) {
        result = keyHandler(maskedValue, key, format, selectionStart, selectionEnd);
        preventDefault(event, result);
      } else if (keyCode === KeyCode.backspace) {
        result = backspaceHandler(maskedValue, format, selectionStart, selectionEnd);
        preventDefault(event, result);
      } else if (keyCode === KeyCode.enter) {
        result = enterHandler(maskedValue, format);
      } else if (!isCommand(keyCode, ctrlKey, metaKey)) {
        event.preventDefault();
      }

      if (result) {
        const { value, position } = result;

        onMaskChange(value);
        setPosition(position);
      }

      // Proxy original event
      onKeyDown && onKeyDown(event);
    },
    onChange: ({ detail }) => onMaskChange(detail.value),
    onBlur: () => {
      if (!disableAutocompleteOnBlur) {
        onAutoComplete(maskedValue, onChange, format);
      }

      onBlur && onBlur();
    },
    onPaste: (event: ClipboardEvent) => {
      const text = (event.clipboardData || (window as any).clipboardData).getData('text');

      const selectionStart = inputRef.current?.selectionStart || 0;
      const selectionEnd = inputRef.current?.selectionEnd || 0;

      const formattedText = format.formatPastedText(text, maskedValue, selectionStart, selectionEnd);
      onMaskChange(formattedText);
    },
  };
};

export default useMask;
