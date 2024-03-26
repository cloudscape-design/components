// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context';
import styles from './styles.css.js';
import InternalIcon from '../../icon/internal';
import { ExpandableItemProps } from './expandable-rows-utils';
import clsx from 'clsx';

export function ExpandToggle({ isExpandable, ...props }: ExpandableItemProps) {
  return isExpandable ? <ExpandToggleButton {...props} /> : null;
}

function ExpandToggleButton({
  isExpanded,
  onExpandableItemToggle,
  expandButtonLabel,
  collapseButtonLabel,
}: Omit<ExpandableItemProps, 'isExpandable'>) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(buttonRef);
  return (
    <button
      ref={buttonRef}
      tabIndex={tabIndex}
      aria-label={isExpanded ? collapseButtonLabel : expandButtonLabel}
      aria-expanded={isExpanded}
      className={styles['expand-toggle']}
      onClick={onExpandableItemToggle}
    >
      <InternalIcon
        size="small"
        name="caret-down-filled"
        className={clsx(styles['expand-toggle-icon'], isExpanded && styles['expand-toggle-icon-expanded'])}
      />
    </button>
  );
}
