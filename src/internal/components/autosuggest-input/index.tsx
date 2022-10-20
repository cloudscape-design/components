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
  InputKeyEvents,
  InputProps,
} from '../../../input/interfaces';
import { getFocusables } from '../focus-lock/utils';
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
  onCloseDropdown?: NonCancelableEventHandler<null>;
  onDelayedInput?: NonCancelableEventHandler<BaseChangeDetail>;
  onPressArrowDown?: () => void;
  onPressArrowUp?: () => void;
  onPressEnter?: () => boolean;
}

export interface AutosuggestInputFocusOptions {
  preventDropdown?: boolean;
}

export interface AutosuggestInputRef extends InputProps.Ref {
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
      dropdownExpanded = true,
      dropdownContentKey,
      dropdownContentFocusable = false,
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

    const handleBlur: React.FocusEventHandler = event => {
      if (
        event.currentTarget.contains(event.relatedTarget) ||
        dropdownContentRef.current?.contains(event.relatedTarget) ||
        dropdownFooterRef.current?.contains(event.relatedTarget)
      ) {
        return;
      }
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
      'aria-controls': ariaControls,
      // 'aria-owns' needed for safari+vo to announce activedescendant content
      'aria-owns': ariaControls,
      'aria-label': ariaLabel,
      'aria-activedescendant': ariaActivedescendant,
    };

    const [trapDropdownFocus, setTrapDropdownFocus] = useState(false);

    // Run this effect on every render to determine if necessary to trap focus around input and dropdown.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
      setTrapDropdownFocus(
        (dropdownFooterRef.current ? getFocusables(dropdownFooterRef.current).length > 0 : false) ||
          (dropdownContentRef.current ? getFocusables(dropdownContentRef.current).length > 0 : false)
      );
    });

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
      <div
        {...baseProps}
        className={clsx(baseProps.className, styles.root)}
        ref={__internalRootRef}
        onBlur={handleBlur}
      >
        <Dropdown
          minWidth={dropdownWidth}
          stretchWidth={!dropdownWidth}
          contentKey={dropdownContentKey}
          trigger={
            <InternalInput
              type="visualSearch"
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
          onMouseDown={handleDropdownMouseDown}
          open={open}
          footer={
            dropdownFooterRef && (
              <div ref={dropdownFooterRef} className={styles['dropdown-footer']}>
                {dropdownFooter}
              </div>
            )
          }
          expandToViewport={expandToViewport}
          trapFocus={trapDropdownFocus}
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
