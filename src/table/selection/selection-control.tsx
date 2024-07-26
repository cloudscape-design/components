// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { KeyboardEvent, KeyboardEventHandler, MouseEvent, useContext } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalCheckbox from '../../checkbox/internal';
import { SingleTabStopNavigationContext } from '../../internal/context/single-tab-stop-navigation-context';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { KeyCode } from '../../internal/keycode';
import RadioButton from '../../radio-group/radio-button';
import { GeneratedAnalyticsMetadataTableSelect } from '../analytics-metadata/interfaces';
import { SelectionProps } from './interfaces';

import styles from './styles.css.js';

export interface SelectionControlProps extends SelectionProps {
  onShiftToggle?(shiftPressed: boolean): void;
  onFocusUp?: KeyboardEventHandler;
  onFocusDown?: KeyboardEventHandler;
  ariaLabel?: string;
  tabIndex?: -1;
  focusedComponent?: null | string;
  rowIndex?: number;
  itemKey?: string;
}

export function SelectionControl({
  selectionType,
  indeterminate = false,
  onShiftToggle,
  onFocusUp,
  onFocusDown,
  name,
  ariaLabel,
  focusedComponent,
  rowIndex,
  itemKey,
  ...sharedProps
}: SelectionControlProps) {
  const controlId = useUniqueId();
  const isMultiSelection = selectionType === 'multi';
  const { navigationActive } = useContext(SingleTabStopNavigationContext);

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
    if (isMultiSelection && !navigationActive) {
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
      showOutline={focusedComponent === 'selection-control'}
      controlId={controlId}
      data-focus-id="selection-control"
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
        title={ariaLabel}
        {...(rowIndex !== undefined && !sharedProps.disabled
          ? getAnalyticsMetadataAttribute({
              detail: {
                position: `${rowIndex + 1}`,
                item: itemKey || '',
              },
            } as Partial<GeneratedAnalyticsMetadataTableSelect>)
          : {})}
      >
        {selector}
      </label>
      <span className={styles.stud} aria-hidden={true}>
        &nbsp;
      </span>
    </>
  );
}
