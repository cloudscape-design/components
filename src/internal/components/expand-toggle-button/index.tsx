// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import clsx from 'clsx';

import InternalIcon from '../../../icon/internal';
import { useSingleTabStopNavigation } from '../../../internal/context/single-tab-stop-navigation-context';

import styles from './styles.css.js';

export function ExpandToggleButton({
  isExpanded,
  onExpandableItemToggle,
  expandButtonLabel,
  collapseButtonLabel,
  customIcon,
  invisible = false,
}: {
  isExpanded?: boolean;
  onExpandableItemToggle?: () => void;
  expandButtonLabel?: string;
  collapseButtonLabel?: string;
  customIcon?: React.ReactNode;
  invisible?: boolean;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(buttonRef);

  if (invisible) {
    return (
      <button
        type="button"
        ref={buttonRef}
        className={clsx(styles['expand-toggle'], styles.invisible)}
        tabIndex={tabIndex}
        data-tree-view-toggle-button={true}
      ></button>
    );
  }

  return (
    <button
      type="button"
      ref={buttonRef}
      tabIndex={tabIndex}
      aria-label={isExpanded ? collapseButtonLabel : expandButtonLabel}
      aria-expanded={isExpanded}
      className={clsx(styles['expand-toggle'], invisible && styles['expand-toggle-invisible'])}
      onClick={onExpandableItemToggle}
      data-tree-view-toggle-button={true} // to do: make it an api
    >
      {customIcon ?? (
        <InternalIcon
          size="small"
          name="caret-down-filled"
          className={clsx(styles['expand-toggle-icon'], isExpanded && styles['expand-toggle-icon-expanded'])}
        />
      )}
    </button>
  );
}
