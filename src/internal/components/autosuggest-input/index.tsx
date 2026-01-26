// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { AutosuggestProps } from '../../../autosuggest/interfaces';
import {
  BaseChangeDetail,
  BaseInputProps,
  InputAutoCorrect,
  InputClearLabel,
  InputKeyEvents,
  InputProps,
} from '../../../input/interfaces';
import InternalInput from '../../../input/internal';
import { BaseComponentProps, getBaseProps } from '../../base-component';
import { FormFieldValidationControlProps, useFormFieldContext } from '../../context/form-field-context';
import { BaseKeyDetail, fireCancelableEvent, fireNonCancelableEvent, NonCancelableEventHandler } from '../../events';
import { InternalBaseComponentProps } from '../../hooks/use-base-component';
import { useIMEComposition } from '../../hooks/use-ime-composition';
import { KeyCode } from '../../keycode';
import { nodeBelongs } from '../../utils/node-belongs';
import { processAttributes } from '../../utils/with-native-attributes';
import Dropdown from '../dropdown';
import { ExpandToViewport } from '../dropdown/interfaces';

import styles from './styles.css.js';

interface AutosuggestInputProps
  extends BaseComponentProps,
    BaseInputProps,
    InputAutoCorrect,
    InputKeyEvents,
    InputClearLabel,
    FormFieldValidationControlProps,
    ExpandToViewport,
    InternalBaseComponentProps {
  ariaControls?: string;
  ariaActivedescendant?: string;
  dropdownExpanded?: boolean;
  dropdownContentKey?: string;
  dropdownContentFocusable?: boolean;
  dropdownContent?: React.ReactNode;
  dropdownFooter?: React.ReactNode;
  dropdownWidth?: number;
  loopFocus?: boolean;
  onCloseDropdown?: NonCancelableEventHandler<null>;
  onDelayedInput?: NonCancelableEventHandler<BaseChangeDetail>;
  onPressArrowDown?: () => void;
  onPressArrowUp?: () => void;
  onPressEnter?: () => boolean;
  style?: InputProps['style'];
}

interface AutosuggestInputFocusOptions {
  preventDropdown?: boolean;
}

export interface AutosuggestInputRef extends AutosuggestProps.Ref {
  focus(options?: AutosuggestInputFocusOptions): void;
  open(): void;
  close(): void;
}

const AutosuggestInput = React.forwardRef(
  (
    {
      value,
      onChange,
      onBlur,
      onFocus,
      onKeyUp,
      onKeyDown,
      name,
      placeholder,
      disabled,
      readOnly,
      autoFocus,
      ariaLabel,
      ariaRequired,
      disableBrowserAutocorrect = false,
      expandToViewport,
      ariaControls,
      ariaActivedescendant,
      clearAriaLabel,
      dropdownExpanded = true,
      dropdownContentKey,
      dropdownContentFocusable = false,
      dropdownContent = null,
      dropdownFooter = null,
      dropdownWidth,
      loopFocus,
      nativeInputAttributes,
      onCloseDropdown,
      onDelayedInput,
      onPressArrowDown,
      onPressArrowUp,
      onPressEnter,
      style,
      __internalRootRef,
      ...restProps
    }: AutosuggestInputProps,
    ref: Ref<AutosuggestInputRef>
  ) => {
    const baseProps = getBaseProps(restProps);
    const formFieldContext = useFormFieldContext(restProps);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownContentRef = useRef<HTMLDivElement>(null);
    const dropdownFooterRef = useRef<HTMLDivElement>(null);
    const preventOpenOnFocusRef = useRef(false);
    const preventCloseOnBlurRef = useRef(false);

    const [open, setOpen] = useState(false);

    const openDropdown = () => !readOnly && setOpen(true);

    const closeDropdown = () => {
      setOpen(false);
      fireNonCancelableEvent(onCloseDropdown, null);
    };

    const { isComposing } = useIMEComposition(inputRef);

    useImperativeHandle(ref, () => ({
      focus(options?: AutosuggestInputFocusOptions) {
        if (options?.preventDropdown) {
          preventOpenOnFocusRef.current = true;
        }
        inputRef.current?.focus();
      },
      select() {
        inputRef.current?.select();
      },
      open: openDropdown,
      close: closeDropdown,
    }));

    const handleBlur = () => {
      if (!preventCloseOnBlurRef.current) {
        closeDropdown();
        fireNonCancelableEvent(onBlur, null);
      }
    };

    const handleFocus = () => {
      if (!preventOpenOnFocusRef.current) {
        openDropdown();
        fireNonCancelableEvent(onFocus, null);
      }
      preventOpenOnFocusRef.current = false;
    };

    const fireKeydown = (event: CustomEvent<BaseKeyDetail>) => fireCancelableEvent(onKeyDown, event.detail, event);

    // Shared ESC key handler logic for both input and dropdown elements
    // When returnFocus is true (from dropdown elements), focus returns to input after closing
    const handleEscapeKey = (returnFocus: boolean) => {
      if (open) {
        closeDropdown();
        if (returnFocus) {
          // Return focus to input when closing from dropdown elements (e.g., recovery button)
          inputRef.current?.focus();
        }
      } else if (value) {
        fireNonCancelableEvent(onChange, { value: '' });
      }
    };

    const handleKeyDown = (event: CustomEvent<BaseKeyDetail>) => {
      switch (event.detail.keyCode) {
        case KeyCode.down: {
          onPressArrowDown?.();
          openDropdown();
          event.preventDefault();
          break;
        }
        case KeyCode.up: {
          onPressArrowUp?.();
          openDropdown();
          event.preventDefault();
          break;
        }
        case KeyCode.enter: {
          if (isComposing()) {
            event.preventDefault();
            return;
          }

          if (open) {
            if (!onPressEnter?.()) {
              closeDropdown();
            }
            event.preventDefault();
          }
          fireKeydown(event);
          break;
        }
        case KeyCode.escape: {
          // Use shared ESC handler, without focus restoration since ESC came from input
          handleEscapeKey(false);
          if (open || value) {
            event.stopPropagation();
          }
          event.preventDefault();
          fireKeydown(event);
          break;
        }
        default: {
          fireKeydown(event);
        }
      }
    };

    const handleChange = (value: string) => {
      openDropdown();
      fireNonCancelableEvent(onChange, { value });
    };

    const handleDelayedInput = (value: string) => {
      fireNonCancelableEvent(onDelayedInput, { value });
    };

    const handleDropdownMouseDown: React.MouseEventHandler = event => {
      // Prevent currently focused element from losing focus.
      if (!dropdownContentFocusable) {
        event.preventDefault();
      }
      // Prevent closing dropdown on click inside.
      else {
        preventCloseOnBlurRef.current = true;
        requestAnimationFrame(() => {
          preventCloseOnBlurRef.current = false;
        });
      }
    };

    const expanded = open && dropdownExpanded;
    const nativeAttributes: BaseInputProps['nativeInputAttributes'] = {
      name,
      placeholder,
      autoFocus,
      onClick: openDropdown,
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-expanded': expanded,
      'aria-controls': open ? ariaControls : undefined,
      // 'aria-owns' needed for safari+vo to announce activedescendant content
      'aria-owns': open ? ariaControls : undefined,
      'aria-label': ariaLabel,
      'aria-activedescendant': ariaActivedescendant,
    };

    // Closes dropdown when outside click is detected.
    // Similar to the internal dropdown implementation but includes the target as well.
    useEffect(() => {
      if (!open) {
        return;
      }

      const clickListener = (event: MouseEvent) => {
        if (
          !nodeBelongs(inputRef.current, event.target) &&
          !nodeBelongs(dropdownContentRef.current, event.target) &&
          !nodeBelongs(dropdownFooterRef.current, event.target)
        ) {
          closeDropdown();
        }
      };

      window.addEventListener('mousedown', clickListener);

      return () => {
        window.removeEventListener('mousedown', clickListener);
      };

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleDropdownKeyDown: React.KeyboardEventHandler = event => {
      // Handle ESC key from focusable elements inside the dropdown (e.g., recovery button)
      // but NOT from the input itself (that's handled by handleKeyDown)
      const isFromInput = event.target === inputRef.current || nodeBelongs(inputRef.current, event.target);

      if (event.key === 'Escape' && !isFromInput) {
        event.stopPropagation();
        event.preventDefault();
        // Use shared ESC handler with focus restoration since ESC came from dropdown element
        handleEscapeKey(true);
      }
    };

    return (
      <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
        <Dropdown
          minWidth={dropdownWidth}
          stretchWidth={!dropdownWidth}
          stretchBeyondTriggerWidth={true}
          contentKey={dropdownContentKey}
          onFocus={handleFocus}
          onBlur={handleBlur}
          trigger={
            <InternalInput
              type="visualSearch"
              value={value}
              onChange={event => handleChange(event.detail.value)}
              __onDelayedInput={event => handleDelayedInput(event.detail.value)}
              onKeyDown={handleKeyDown}
              onKeyUp={onKeyUp}
              disabled={disabled}
              disableBrowserAutocorrect={disableBrowserAutocorrect}
              readOnly={readOnly}
              ariaRequired={ariaRequired}
              clearAriaLabel={clearAriaLabel}
              ref={inputRef}
              autoComplete={false}
              nativeInputAttributes={processAttributes(nativeAttributes, nativeInputAttributes, 'Autosuggest')}
              __skipNativeAttributesWarnings={Object.keys(nativeAttributes)}
              style={style}
              {...formFieldContext}
            />
          }
          onMouseDown={handleDropdownMouseDown}
          open={open && (!!dropdownContent || !!dropdownFooter)}
          footer={
            dropdownFooterRef && (
              <div ref={dropdownFooterRef} className={styles['dropdown-footer']} onKeyDown={handleDropdownKeyDown}>
                {open && dropdownFooter ? dropdownFooter : null}
              </div>
            )
          }
          expandToViewport={expandToViewport}
          loopFocus={loopFocus}
        >
          {open && dropdownContent ? (
            <div ref={dropdownContentRef} className={styles['dropdown-content']}>
              {dropdownContent}
            </div>
          ) : null}
        </Dropdown>
      </div>
    );
  }
);

export default AutosuggestInput;
