// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context';
import styles from './styles.css.js';
import InternalIcon from '../../icon/internal';

interface ExpandToggleProps {
  isExpanded: boolean;
  isExpandable: boolean;
  onExpandableItemToggle: () => void;
  expandButtonLabel?: string;
  collapseButtonLabel?: string;
}

export function ExpandToggle({ isExpandable, ...props }: ExpandToggleProps) {
  return isExpandable ? <ExpandToggleButton {...props} /> : <ExpandTogglePlaceholder />;
}

function ExpandToggleButton({
  isExpanded,
  onExpandableItemToggle,
  expandButtonLabel,
  collapseButtonLabel,
}: Omit<ExpandToggleProps, 'isExpandable'>) {
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
      {isExpanded ? (
        <InternalIcon size="small" name="caret-down-filled" />
      ) : (
        <InternalIcon size="small" name="caret-right-filled" />
      )}
    </button>
  );
}

function ExpandTogglePlaceholder() {
  return (
    <div aria-hidden={true} className={styles['expand-toggle-hidden']}>
      <InternalIcon size="small" name="caret-right-filled" />
    </div>
  );
}
