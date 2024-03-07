// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context';
import styles from './styles.css.js';
import InternalIcon from '../../icon/internal';
import clsx from 'clsx';

export function ExpandToggleButton({
  isExpanded,
  onExpandableItemToggle,
  expandButtonLabel,
  collapseButtonLabel,
}: {
  isExpanded: boolean;
  onExpandableItemToggle: () => void;
  expandButtonLabel?: string;
  collapseButtonLabel?: string;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(buttonRef);
  return (
    <button
      ref={buttonRef}
      tabIndex={tabIndex}
      aria-label={isExpanded ? collapseButtonLabel : expandButtonLabel}
      className={styles['expand-toggle']}
      onClick={() => onExpandableItemToggle()}
    >
      {isExpanded ? (
        <InternalIcon size="small" name="caret-down-filled" />
      ) : (
        <InternalIcon size="small" name="caret-right-filled" />
      )}
    </button>
  );
}

export function ExpandTogglePlaceholder() {
  return (
    <button
      disabled={true}
      aria-hidden={true}
      className={clsx(styles['expand-toggle'], styles['expand-toggle-hidden'])}
    >
      <InternalIcon size="small" name="caret-right-filled" />
    </button>
  );
}
