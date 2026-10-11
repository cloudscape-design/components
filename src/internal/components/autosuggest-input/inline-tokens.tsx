// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import {
  SingleTabStopNavigationAPI,
  SingleTabStopNavigationProvider,
} from '@cloudscape-design/component-toolkit/internal';

import { AutosuggestProps } from '../../../autosuggest/interfaces';
import InternalToken from '../../../token/internal';
import { KeyCode, KeyCodeDelete } from '../../keycode';
import handleKey from '../../utils/handle-key';
import { nodeBelongs } from '../../utils/node-belongs';
import { getAllFocusables } from '../focus-lock/utils';
import { OverflowDropdown } from './overflow-dropdown';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export interface InlineTokensProps {
  tokens: ReadonlyArray<AutosuggestProps.Token>;
  visibleCount: number;
  disabled?: boolean;
  readOnly?: boolean;
  expandToViewport?: boolean;
  overflowOpen: boolean;
  tokenDismissLabel?: (value: string) => string;
  tokenOverflowAriaLabel?: (hiddenCount: number) => string;
  onOverflowOpenChange: (open: boolean) => void;
  onDismiss: (index: number, source: 'inline' | 'overflow') => void;
  onFocusEnter: () => void;
  onNavigateToInput: () => void;
}

export interface InlineTokensRef {
  focusLast(): void;
}

export const InlineTokens = forwardRef(
  (
    {
      tokens,
      visibleCount,
      disabled,
      readOnly,
      expandToViewport,
      overflowOpen,
      tokenDismissLabel,
      tokenOverflowAriaLabel,
      onOverflowOpenChange,
      onDismiss,
      onFocusEnter,
      onNavigateToInput,
    }: InlineTokensProps,
    ref: React.Ref<InlineTokensRef>
  ) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const navigationAPI = useRef<SingleTabStopNavigationAPI>(null);
    const lastFocusedRef = useRef<HTMLElement | null>(null);

    const hiddenCount = tokens.length - visibleCount;
    const hiddenTokens = tokens.slice(0, hiddenCount);
    const visibleTokens = tokens.slice(hiddenCount);

    const getFocusables = () =>
      rootRef.current ? getAllFocusables(rootRef.current).filter(el => navigationAPI.current?.isRegistered(el)) : [];

    const getNextFocusTarget = () => {
      if (disabled) {
        return null;
      }
      const focusables = getFocusables();
      const lastFocused = lastFocusedRef.current;
      return (lastFocused && focusables.includes(lastFocused) ? lastFocused : focusables[0]) ?? null;
    };

    useEffect(() => {
      navigationAPI.current?.updateFocusTarget();
    });

    useImperativeHandle(ref, () => ({
      focusLast: () => getFocusables().pop()?.focus(),
    }));

    const onFocus = (event: React.FocusEvent) => {
      if (!nodeBelongs(rootRef.current, event.relatedTarget)) {
        onFocusEnter();
      }
      if (event.target instanceof HTMLElement && navigationAPI.current?.isRegistered(event.target)) {
        lastFocusedRef.current = event.target;
      }
      navigationAPI.current?.updateFocusTarget();
    };

    const onBlur = (event: React.FocusEvent) => {
      if (!nodeBelongs(rootRef.current, event.relatedTarget)) {
        lastFocusedRef.current = null;
      }
      navigationAPI.current?.updateFocusTarget();
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
      const focusables = getFocusables();
      const activeIndex = focusables.indexOf(event.target as HTMLElement);
      if (activeIndex === -1) {
        return;
      }
      handleKey(event as React.KeyboardEvent<HTMLElement>, {
        onInlineStart: () => {
          event.preventDefault();
          focusables[activeIndex - 1]?.focus();
        },
        onInlineEnd: () => {
          event.preventDefault();
          if (activeIndex < focusables.length - 1) {
            focusables[activeIndex + 1].focus();
          } else {
            onNavigateToInput();
          }
        },
        onHome: () => {
          event.preventDefault();
          focusables[0].focus();
        },
        onEnd: () => {
          event.preventDefault();
          onNavigateToInput();
        },
      });
    };

    return (
      <div ref={rootRef} className={styles['inline-tokens']} onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown}>
        <SingleTabStopNavigationProvider
          ref={navigationAPI}
          navigationActive={true}
          getNextFocusTarget={getNextFocusTarget}
        >
          {hiddenCount > 0 && (
            <OverflowDropdown
              tokens={hiddenTokens}
              open={overflowOpen}
              disabled={disabled}
              readOnly={readOnly}
              expandToViewport={expandToViewport}
              tokenDismissLabel={tokenDismissLabel}
              tokenOverflowAriaLabel={tokenOverflowAriaLabel}
              onOpenChange={onOverflowOpenChange}
              onDismiss={index => onDismiss(index, 'overflow')}
            />
          )}
          {visibleTokens.length > 0 && (
            <ul className={clsx(styles['token-list'], testUtilStyles['token-list'])}>
              {visibleTokens.map((token, i) => {
                const index = hiddenCount + i;
                return (
                  <li
                    key={index}
                    className={clsx(styles['token-list-item'], testUtilStyles['token-list-item'])}
                    aria-setsize={tokens.length}
                    aria-posinset={index + 1}
                    onKeyDown={event => {
                      if (event.keyCode === KeyCode.backspace || event.keyCode === KeyCodeDelete) {
                        event.preventDefault();
                        if (!readOnly && !disabled) {
                          onDismiss(index, 'inline');
                        }
                      }
                    }}
                  >
                    <InternalToken
                      label={token.value}
                      dismissLabel={tokenDismissLabel?.(token.value)}
                      icon={token.icon}
                      variant="inline"
                      disabled={disabled}
                      readOnly={readOnly}
                      onDismiss={() => onDismiss(index, 'inline')}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </SingleTabStopNavigationProvider>
      </div>
    );
  }
);
