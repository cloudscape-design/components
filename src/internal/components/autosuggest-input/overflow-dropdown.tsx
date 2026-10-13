// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import {
  SingleTabStopNavigationReset,
  useMergeRefs,
  useSingleTabStopNavigation,
  useUniqueId,
} from '@cloudscape-design/component-toolkit/internal';

import { AutosuggestProps } from '../../../autosuggest/interfaces';
import InternalDropdown from '../../../dropdown/internal';
import InternalToken from '../../../token/internal';
import { BaseKeyDetail, CancelableEventHandler } from '../../../types/events';
import { getBreakpointValue } from '../../breakpoints';
import { useListFocusController } from '../../hooks/use-list-focus-controller';
import { KeyCode } from '../../keycode';
import { circleIndex } from '../../utils/circle-index';
import handleKey from '../../utils/handle-key';
import ButtonTrigger from '../button-trigger';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export interface OverflowDropdownProps {
  tokens: ReadonlyArray<AutosuggestProps.Token>;
  open: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  expandToViewport?: boolean;
  triggerRef?: React.Ref<HTMLButtonElement>;
  tokenDismissLabel?: (value: string) => string;
  tokenOverflowAriaLabel?: (hiddenCount: number) => string;
  onOpenChange: (open: boolean) => void;
  onDismiss: (index: number) => void;
}

export function OverflowDropdown({
  tokens,
  open,
  disabled,
  readOnly,
  expandToViewport,
  triggerRef,
  tokenDismissLabel,
  tokenOverflowAriaLabel,
  onOpenChange,
  onDismiss,
}: OverflowDropdownProps) {
  const dropdownId = useUniqueId('token-overflow-');
  const triggerObjectRef = useRef<HTMLButtonElement>(null);
  const mergedTriggerRef = useMergeRefs(triggerRef, triggerObjectRef);
  const { tabIndex } = useSingleTabStopNavigation(triggerObjectRef);

  const [nextFocusIndex, setNextFocusIndex] = useState<number | null>(null);
  const listRef = useListFocusController({
    nextFocusIndex,
    onFocusMoved: target => {
      target.focus();
      setNextFocusIndex(null);
    },
    listItemSelector: `.${styles['overflow-dropdown-item']}`,
  });

  const getItemButtons = () =>
    Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>(`.${styles['overflow-dropdown-item']} button`) ?? []
    );

  const close = (returnFocus: boolean) => {
    onOpenChange(false);
    if (returnFocus) {
      triggerObjectRef.current?.focus();
    }
  };

  const focusItem = (index: number) => {
    const buttons = getItemButtons();
    buttons[circleIndex(index, [0, buttons.length - 1])]?.focus();
  };

  const openAndFocus = (index: number) => {
    setNextFocusIndex(index);
    onOpenChange(true);
  };

  const onTriggerKeyDown: CancelableEventHandler<BaseKeyDetail> = event => {
    if (event.detail.keyCode === KeyCode.down) {
      event.preventDefault();
      openAndFocus(0);
    } else if (event.detail.keyCode === KeyCode.up) {
      event.preventDefault();
      openAndFocus(tokens.length - 1);
    }
  };

  const dismiss = (index: number) => {
    if (tokens.length > 1) {
      setNextFocusIndex(index);
    }
    onDismiss(index);
  };

  const onListKeyDown = (event: React.KeyboardEvent) => {
    const focusedIndex = getItemButtons().indexOf(document.activeElement as HTMLButtonElement);
    const dismissFocused = () => {
      event.preventDefault();
      if (focusedIndex !== -1 && !readOnly && !disabled) {
        dismiss(focusedIndex);
      }
    };
    handleKey(event as React.KeyboardEvent<HTMLElement>, {
      onTab: () => close(false),
      onBackspace: dismissFocused,
      onDelete: dismissFocused,
      onBlockEnd: () => {
        event.preventDefault();
        focusItem(focusedIndex + 1);
      },
      onBlockStart: () => {
        event.preventDefault();
        focusItem(focusedIndex - 1);
      },
    });
  };

  return (
    <div className={styles['token-overflow']}>
      <InternalDropdown
        open={open}
        expandToViewport={expandToViewport}
        maxWidth={getBreakpointValue('xxs')}
        onEscape={() => close(true)}
        onOutsideClick={() => close(false)}
        trigger={
          <ButtonTrigger
            ref={mergedTriggerRef}
            compact={true}
            tabIndex={tabIndex}
            disabled={disabled}
            pressed={open}
            className={clsx(styles['token-overflow-trigger'], testUtilStyles['token-overflow-trigger'])}
            ariaHasPopup={false}
            ariaControls={open ? dropdownId : undefined}
            ariaLabel={tokenOverflowAriaLabel?.(tokens.length)}
            onClick={() => onOpenChange(!open)}
            onKeyDown={onTriggerKeyDown}
          >
            {`+${tokens.length}`}
          </ButtonTrigger>
        }
        content={
          <SingleTabStopNavigationReset>
            <div ref={listRef} onKeyDown={onListKeyDown}>
              <ul id={dropdownId} className={clsx(styles['overflow-dropdown'], testUtilStyles['overflow-dropdown'])}>
                {tokens.map((token, index) => (
                  <li key={index} className={styles['overflow-dropdown-item']}>
                    <InternalToken
                      label={token.value}
                      dismissLabel={tokenDismissLabel?.(token.value)}
                      icon={token.icon}
                      variant="inline"
                      disabled={disabled}
                      readOnly={readOnly}
                      onDismiss={() => dismiss(index)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </SingleTabStopNavigationReset>
        }
      />
    </div>
  );
}
