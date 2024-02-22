// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import clsx from 'clsx';
import React, { useRef } from 'react';
import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context';
import styles from './styles.css.js';
import InternalIcon from '../../icon/internal';

export function ExpandToggleButton({
  isExpandable,
  isExpanded,
  onExpandableItemToggle,
}: {
  isExpandable: boolean;
  isExpanded: boolean;
  onExpandableItemToggle: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(buttonRef);
  return (
    <button
      ref={buttonRef}
      tabIndex={tabIndex}
      className={clsx(styles['expand-toggle'], !isExpandable && styles['expand-toggle-hidden'])}
      onClick={() => onExpandableItemToggle()}
    >
      {isExpanded ? <InternalIcon name="caret-down-filled" /> : <InternalIcon name="caret-right-filled" />}
    </button>
  );
}
