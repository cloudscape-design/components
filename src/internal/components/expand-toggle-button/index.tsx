// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import clsx from 'clsx';

import { isThemeActive, Theme, useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';

import InternalIcon from '../../../icon/internal';

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
      data-awsui-motion-trigger="hover"
    >
      {/* Marks the POSITION the button defines for its toggle icon, not just the default caret:
          a consumer-substituted `customIcon` sits in this exact slot and re-skins the same
          affordance, so it animates too — unlike a slot where consumer content merely happens
          to land inside a region. A raw builder `<svg>` still won't animate (no
          `data-awsui-icon-animated`). */}
      <span data-awsui-motion-target="true">
        {customIcon ?? (
          <InternalIcon
            size={isThemeActive(Theme.OneTheme) ? 'x-small' : 'small'}
            name={isThemeActive(Theme.OneTheme) ? 'angle-down' : 'caret-down-filled'}
            className={clsx(styles['expand-toggle-icon'], isExpanded && styles['expand-toggle-icon-expanded'])}
          />
        )}
      </span>
    </button>
  );
}
