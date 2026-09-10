// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import clsx from 'clsx';

import { isThemeActive, Theme, useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';

import { CustomizableIcon } from '../customizable-icon';

import styles from './styles.css.js';

export function ExpandToggleButton({
  isExpanded,
  onExpandableItemToggle,
  expandButtonLabel,
  collapseButtonLabel,
  customIcon,
  expandToggleIcon,
  className,
  disableFocusHighlight,
}: {
  isExpanded?: boolean;
  onExpandableItemToggle?: () => void;
  expandButtonLabel?: string;
  collapseButtonLabel?: string;
  customIcon?: React.ReactNode;
  expandToggleIcon?: (state: { expanded: boolean }) => React.ReactNode;
  className?: string;
  disableFocusHighlight?: boolean;
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
      className={clsx(styles['expand-toggle'], disableFocusHighlight && styles['disable-focus-highlight'], className)}
      onClick={onExpandableItemToggle}
      data-awsui-motion-trigger="hover"
      data-awsui-motion-target=""
    >
      {customIcon ?? (
        <CustomizableIcon
          customIcon={expandToggleIcon?.({ expanded: !!isExpanded })}
          size={isThemeActive(Theme.OneTheme) ? 'x-small' : 'small'}
          fallback={{
            name: isThemeActive(Theme.OneTheme) ? 'angle-down' : 'caret-down-filled',
            className: clsx(styles['expand-toggle-icon'], isExpanded && styles['expand-toggle-icon-expanded']),
          }}
        />
      )}
    </button>
  );
}
