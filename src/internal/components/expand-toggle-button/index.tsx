// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import clsx from 'clsx';

import { useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';

import InternalIcon from '../../../icon/internal';

import styles from './styles.css.js';

export function ExpandToggleButton({
  isExpanded,
  onExpandableItemToggle,
  expandButtonLabel,
  collapseButtonLabel,
  customIcon,
  dataAttribute,
}: {
  isExpanded?: boolean;
  onExpandableItemToggle?: () => void;
  expandButtonLabel?: string;
  collapseButtonLabel?: string;
  customIcon?: React.ReactNode;
  dataAttribute?: { [key: string]: boolean };
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(buttonRef);

  return (
    <button
      type="button"
      ref={buttonRef}
      tabIndex={tabIndex}
      aria-label={isExpanded ? collapseButtonLabel : expandButtonLabel}
      aria-expanded={isExpanded}
      className={clsx(styles['expand-toggle'])}
      onClick={onExpandableItemToggle}
      {...dataAttribute}
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
