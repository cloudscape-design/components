// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import clsx from 'clsx';

import { isThemeActive, Theme, useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';

import { IconOverride } from '../../../icon-provider/icon-override';

import styles from './styles.css.js';

export function ExpandToggleButton({
  isExpanded,
  onExpandableItemToggle,
  expandButtonLabel,
  collapseButtonLabel,
  customIcon,
  className,
  disableFocusHighlight,
}: {
  isExpanded?: boolean;
  onExpandableItemToggle?: () => void;
  expandButtonLabel?: string;
  collapseButtonLabel?: string;
  customIcon?: React.ReactNode;
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
    >
      {customIcon ?? (
        <IconOverride
          overrideName="expand-toggle"
          state={{ expanded: !!isExpanded }}
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
