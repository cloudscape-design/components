// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { KeyboardEvent, KeyboardEventHandler, MouseEvent } from 'react';
import { KeyCode } from '../../internal/keycode';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import InternalCheckbox from '../../checkbox/internal';
import RadioButton from '../../radio-group/radio-button';

import styles from './styles.css.js';
import { InteractiveComponent } from '../thead';
import { SelectionProps } from '../use-selection';

export interface SelectionControlProps extends SelectionProps {
  onShiftToggle?(shiftPressed: boolean): void;
  onFocusUp?: KeyboardEventHandler;
  onFocusDown?: KeyboardEventHandler;
  ariaLabel?: string;
  tabIndex?: -1;

  focusedComponent?: InteractiveComponent | null;
  onFocusedComponentChange?: (element: InteractiveComponent | null) => void;
}

export default function SelectionControl({
  selectionType,
  indeterminate = false,
  onShiftToggle,
  onFocusUp,
  onFocusDown,
  name,
  ariaLabel,

  focusedComponent,
  onFocusedComponentChange,
  ...sharedProps
}: SelectionControlProps) {
  const controlId = useUniqueId();
  const isMultiSelection = selectionType === 'multi';

  const setShiftState = (event: KeyboardEvent | MouseEvent) => {
    if (isMultiSelection) {
      onShiftToggle && onShiftToggle(event.shiftKey);
    }
  };

  const onMouseDownHandler = (event: MouseEvent) => {
    setShiftState(event);
    if (isMultiSelection) {
      // To overcome an issue
      // If you shift+click or ctrl+click on a label for a checkbox, checkbox is not checked.
      // https://bugzilla.mozilla.org/show_bug.cgi?id=559506
      event.preventDefault();
    }
  };

  // native checkboxes do not have focus move via keyboard, we implement it here programmatically
  const handleKeyDown = (event: KeyboardEvent) => {
    setShiftState(event);
    if (isMultiSelection) {
      if (event.keyCode === KeyCode.up) {
        event.preventDefault();
        onFocusUp && onFocusUp(event);
      }
      if (event.keyCode === KeyCode.down) {
        event.preventDefault();
        onFocusDown && onFocusDown(event);
      }
    }
  };

  const handleClick = (event: MouseEvent) => {
    const target = event.currentTarget;
    const nativeInput = (target.tagName === 'INPUT' ? target : target.querySelector('input')) as HTMLInputElement;
    // Clicking on input, does not focus it on Firefox (AWSUI-11345)
    nativeInput?.focus();
  };

  const selector = isMultiSelection ? (
    <InternalCheckbox
      {...sharedProps}
      showOutline={focusedComponent?.type === 'selection'}
      onFocus={() => onFocusedComponentChange?.({ type: 'selection' })}
      onBlur={() => onFocusedComponentChange?.(null)}
      controlId={controlId}
      indeterminate={indeterminate}
    />
  ) : (
    <RadioButton {...sharedProps} controlId={controlId} name={name} value={''} label={''} />
  );

  return (
    <>
      <label
        onKeyDown={handleKeyDown}
        onKeyUp={setShiftState}
        onMouseDown={onMouseDownHandler}
        onMouseUp={setShiftState}
        onClick={handleClick}
        htmlFor={controlId}
        className={clsx(styles.label, styles.root)}
        aria-label={ariaLabel}
      >
        {selector}
      </label>
      {/* HACK: IE11 collapses td's height to 0, if it contains only an absouletely positioned label */}
      <span className={clsx(styles.stud)} aria-hidden={true}>
        &nbsp;
      </span>
    </>
  );
}
