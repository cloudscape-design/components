// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { AutosuggestProps } from '../../../autosuggest/interfaces';
import InternalToken from '../../../token/internal';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.selectors.js';

export interface OverflowDropdownProps {
  tokens: ReadonlyArray<AutosuggestProps.Token>;
  triggerRef: React.RefObject<HTMLButtonElement>;
  open: boolean;
  onDismiss: (index: number) => void;
  onClose: () => void;
  tokenDismissLabel?: (value: string) => string;
  readOnly?: boolean;
}

export function OverflowDropdown({
  tokens,
  triggerRef,
  open,
  onDismiss,
  onClose,
  tokenDismissLabel,
  readOnly,
}: OverflowDropdownProps) {
  const pendingFocusAfterDismissRef = useRef<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const first = listRef.current?.querySelector<HTMLElement>('button');
    first?.focus();
  }, [open]);

  // No deps: runs after every render to handle focus restoration after a token dismiss.
  useEffect(() => {
    if (pendingFocusAfterDismissRef.current === null) {
      return;
    }
    const dismissedIndex = pendingFocusAfterDismissRef.current;
    pendingFocusAfterDismissRef.current = null;
    if (tokens.length === 0) {
      return;
    }
    const nextPosition = Math.min(dismissedIndex, tokens.length - 1);
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('button');
    if (buttons && buttons[nextPosition]) {
      buttons[nextPosition].focus();
    }
  });

  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      triggerRef.current?.focus();
    } else if (e.key === 'Tab') {
      onClose();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      const buttons = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
      if (buttons.length === 0) {
        return;
      }
      const focused = buttons.indexOf(document.activeElement as HTMLButtonElement);
      if (e.key === 'ArrowUp') {
        const prev = focused > 0 ? focused - 1 : buttons.length - 1;
        buttons[prev].focus();
      } else {
        const next = focused < buttons.length - 1 ? focused + 1 : 0;
        buttons[next].focus();
      }
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose, triggerRef]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      onMouseDown={e => e.preventDefault()}
      onKeyDown={handlePanelKeyDown}
      className={clsx(styles['overflow-panel'], testUtilStyles['overflow-panel'])}
    >
      <ul ref={listRef} role="list" className={styles['overflow-panel-list']}>
        {tokens.map((token, i) => (
          <li key={i} className={styles['overflow-panel-item']}>
            <InternalToken
              label={token.value}
              dismissLabel={tokenDismissLabel ? tokenDismissLabel(token.value) : token.value}
              icon={token.icon}
              variant="inline"
              readOnly={readOnly}
              onDismiss={() => {
                pendingFocusAfterDismissRef.current = i;
                onDismiss(i);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
