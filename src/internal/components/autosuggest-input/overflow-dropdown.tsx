// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import {
  isThemeActive,
  SingleTabStopNavigationReset,
  Theme,
  useMergeRefs,
  useSingleTabStopNavigation,
  useUniqueId,
} from '@cloudscape-design/component-toolkit/internal';

import { AutosuggestProps } from '../../../autosuggest/interfaces';
import InternalDropdown from '../../../dropdown/internal';
import InternalIcon from '../../../icon/internal';
import InternalToken from '../../../token/internal';
import { getBreakpointValue } from '../../breakpoints';
import { useListFocusController } from '../../hooks/use-list-focus-controller';
import { circleIndex } from '../../utils/circle-index';
import handleKey from '../../utils/handle-key';

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

  const onTriggerKeyDown = (event: React.KeyboardEvent) => {
    handleKey(event as React.KeyboardEvent<HTMLElement>, {
      onBlockEnd: () => {
        event.preventDefault();
        openAndFocus(0);
      },
      onBlockStart: () => {
        event.preventDefault();
        openAndFocus(tokens.length - 1);
      },
    });
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
          <button
            ref={mergedTriggerRef}
            type="button"
            tabIndex={tabIndex}
            disabled={disabled}
            className={clsx(styles['token-overflow-trigger'], testUtilStyles['token-overflow-trigger'])}
            aria-expanded={open}
            aria-controls={open ? dropdownId : undefined}
            aria-label={tokenOverflowAriaLabel?.(tokens.length)}
            onClick={() => onOpenChange(!open)}
            onKeyDown={onTriggerKeyDown}
          >
            <OverflowTriggerContent hiddenCount={tokens.length} open={open} />
          </button>
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

export function OverflowTriggerContent({ hiddenCount, open }: { hiddenCount: number; open: boolean }) {
  const isOneTheme = isThemeActive(Theme.OneTheme);
  return (
    <>
      {`+${hiddenCount}`}
      <span className={clsx(styles['token-overflow-trigger-icon'], open && styles['token-overflow-trigger-icon-open'])}>
        <InternalIcon name={isOneTheme ? 'angle-down' : 'caret-down-filled'} size={isOneTheme ? 'x-small' : 'normal'} />
      </span>
    </>
  );
}
