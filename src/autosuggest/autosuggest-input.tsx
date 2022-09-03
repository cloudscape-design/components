// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Ref, useRef, useState, useImperativeHandle } from 'react';

import Dropdown from '../internal/components/dropdown';

import { FormFieldValidationControlProps, useFormFieldContext } from '../internal/context/form-field-context';
import { BaseComponentProps, getBaseProps } from '../internal/base-component';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import {
  BaseKeyDetail,
  fireCancelableEvent,
  fireNonCancelableEvent,
  getBlurEventRelatedTarget,
  NonCancelableEventHandler,
} from '../internal/events';
import InternalInput from '../input/internal';
import { BaseChangeDetail, BaseInputProps, InputKeyEvents, InputProps } from '../input/interfaces';
import { getFocusables } from '../internal/components/focus-lock/utils';
import { ExpandToViewport } from '../internal/components/dropdown/interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { KeyCode } from '../internal/keycode';
import styles from './styles.css.js';

export interface AutosuggestInputProps
  extends BaseComponentProps,
    BaseInputProps,
    InputKeyEvents,
    FormFieldValidationControlProps,
    ExpandToViewport,
    InternalBaseComponentProps {
  ariaControls?: string;
  ariaActivedescendant?: string;
  dropdownExpanded?: boolean;
  dropdownContent?: React.ReactNode;
  dropdownFooter?: React.ReactNode;
  dropdownWidth?: number;
  onCloseDropdown?: NonCancelableEventHandler<null>;
  onDelayedInput?: NonCancelableEventHandler<BaseChangeDetail>;
  onPressArrowDown?: () => void;
  onPressArrowUp?: () => void;
  onPressEnter?: () => boolean;
}

export interface AutosuggestInputRef extends InputProps.Ref {
  focusNoOpen(): void;
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
      dropdownExpanded,
      dropdownContent = null,
      dropdownFooter = null,
      dropdownWidth,
      onCloseDropdown,
      onDelayedInput,
      onPressArrowDown,
      onPressArrowUp,
      onPressEnter,
      __internalRootRef,
      ...restProps
    }: AutosuggestInputProps,
    ref: Ref<AutosuggestInputRef>
  ) => {
    const baseProps = getBaseProps(restProps);
    const formFieldContext = useFormFieldContext(restProps);

    const dropdownId = useUniqueId('dropdown');

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownContentRef = useRef<HTMLDivElement>(null);
    const dropdownFooterRef = useRef<HTMLDivElement>(null);
    const preventOpenOnFocusRef = useRef(false);

    const [open, setOpen] = useState(false);

    const openDropdown = () => !readOnly && setOpen(true);

    const closeDropdown = () => {
      setOpen(false);
      fireNonCancelableEvent(onCloseDropdown, null);
    };

    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus();
      },
      select() {
        inputRef.current?.select();
      },
      focusNoOpen() {
        preventOpenOnFocusRef.current = true;
        inputRef.current?.focus();
      },
      open: openDropdown,
      close: closeDropdown,
    }));

    const handleBlur: React.FocusEventHandler = event => {
      const relatedTarget = getBlurEventRelatedTarget(event.nativeEvent);
      if (event.currentTarget.contains(relatedTarget) || dropdownFooterRef.current?.contains(relatedTarget)) {
        return;
      }
      closeDropdown();
      fireNonCancelableEvent(onBlur, null);
    };

    const handleFocus = () => {
      if (!preventOpenOnFocusRef.current) {
        openDropdown();
        fireNonCancelableEvent(onFocus, null);
      }
      preventOpenOnFocusRef.current = false;
    };

    const handleMouseDown: React.MouseEventHandler = event => {
      // Prevent currently focused element from losing focus.
      event.preventDefault();
    };

    const handleKeyDown = (e: CustomEvent<BaseKeyDetail>) => {
      switch (e.detail.keyCode) {
        case KeyCode.down: {
          onPressArrowDown?.();
          openDropdown();
          e.preventDefault();
          break;
        }
        case KeyCode.up: {
          onPressArrowUp?.();
          openDropdown();
          e.preventDefault();
          break;
        }
        case KeyCode.enter: {
          if (open) {
            if (!onPressEnter?.()) {
              closeDropdown();
            }
            e.preventDefault();
          }
          fireCancelableEvent(onKeyDown, e.detail);
          break;
        }
        case KeyCode.escape: {
          if (open) {
            closeDropdown();
          } else if (value) {
            fireNonCancelableEvent(onChange, { value: '' });
          }
          e.preventDefault();
          fireCancelableEvent(onKeyDown, e.detail);
          break;
        }
        default: {
          fireCancelableEvent(onKeyDown, e.detail);
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

    const expanded = open && (dropdownExpanded ?? !!dropdownContent);
    const nativeAttributes = {
      name,
      placeholder,
      autoFocus,
      onClick: openDropdown,
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-expanded': expanded,
      'aria-controls': ariaControls,
      // 'aria-owns' needed for safari+vo to announce activedescendant content
      'aria-owns': ariaControls,
      'aria-label': ariaLabel,
      'aria-activedescendant': ariaActivedescendant,
    };

    const trapDropdownFocus =
      (dropdownFooterRef.current ? getFocusables(dropdownFooterRef.current).length > 0 : false) ||
      (dropdownContentRef.current ? getFocusables(dropdownContentRef.current).length > 0 : false);

    return (
      <div {...baseProps} ref={__internalRootRef} onBlur={handleBlur}>
        <Dropdown
          minWidth={dropdownWidth}
          stretchWidth={!dropdownWidth}
          trigger={
            <InternalInput
              type="search"
              value={value}
              onChange={event => handleChange(event.detail.value)}
              __onDelayedInput={event => handleDelayedInput(event.detail.value)}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              onKeyUp={onKeyUp}
              disabled={disabled}
              disableBrowserAutocorrect={disableBrowserAutocorrect}
              readOnly={readOnly}
              ariaRequired={ariaRequired}
              ref={inputRef}
              autoComplete={false}
              __nativeAttributes={nativeAttributes}
              {...formFieldContext}
            />
          }
          onMouseDown={handleMouseDown}
          open={open}
          dropdownId={dropdownId}
          footer={
            dropdownFooterRef && (
              <div ref={dropdownFooterRef} className={styles['dropdown-footer']}>
                {dropdownFooter}
              </div>
            )
          }
          expandToViewport={expandToViewport}
          hasContent={expanded}
          trapFocus={trapDropdownFocus}
        >
          <div ref={dropdownContentRef}>{open && dropdownContent}</div>
        </Dropdown>
      </div>
    );
  }
);

export default AutosuggestInput;
