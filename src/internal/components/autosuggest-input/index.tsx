// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Ref, useRef, useState, useImperativeHandle, useEffect } from 'react';

import Dropdown from '../dropdown';

import { FormFieldValidationControlProps, useFormFieldContext } from '../../context/form-field-context';
import { BaseComponentProps, getBaseProps } from '../../base-component';
import { BaseKeyDetail, fireCancelableEvent, fireNonCancelableEvent, NonCancelableEventHandler } from '../../events';
import InternalInput from '../../../input/internal';
import {
  BaseChangeDetail,
  BaseInputProps,
  InputAutoCorrect,
  InputClearLabel,
  InputKeyEvents,
} from '../../../input/interfaces';
import { AutosuggestProps } from '../../../autosuggest/interfaces';
import { ExpandToViewport } from '../dropdown/interfaces';
import { InternalBaseComponentProps } from '../../hooks/use-base-component';
import { KeyCode } from '../../keycode';
import styles from './styles.css.js';
import clsx from 'clsx';

export interface AutosuggestInputProps
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
}

export interface AutosuggestInputFocusOptions {
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
      expandDropdownWidth,
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
    const nativeAttributes = {
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
          !inputRef.current?.contains(event.target as Node) &&
          !dropdownContentRef.current?.contains(event.target as Node) &&
          !dropdownFooterRef.current?.contains(event.target as Node)
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

    return (
      <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
        <Dropdown
          minWidth={dropdownWidth}
          stretchWidth={!dropdownWidth}
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
              __nativeAttributes={nativeAttributes}
              {...formFieldContext}
            />
          }
          onMouseDown={handleDropdownMouseDown}
          open={open && !!dropdownContent}
          footer={
            dropdownFooterRef && (
              <div ref={dropdownFooterRef} className={styles['dropdown-footer']}>
                {dropdownFooter}
              </div>
            )
          }
          expandToViewport={expandToViewport}
          expandDropdownWidth={expandDropdownWidth}
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
