// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../../button/interfaces';
import { IconProps } from '../../icon/interfaces';
import Icon from '../../icon/internal';
import Tooltip from '../../internal/components/tooltip/index.js';

import styles from './styles.css.js';

export interface TriggerButtonProps {
  ariaLabel?: string;
  className?: string;
  iconName?: IconProps.Name;
  iconSvg?: React.ReactNode;
  ariaExpanded: boolean | undefined;
  ariaControls?: string;
  testId?: string;
  tooltipText?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
  badge?: boolean;
  highContrastHeader?: boolean;
}

function TriggerButton(
  {
    ariaLabel,
    className,
    iconName,
    iconSvg,
    ariaExpanded,
    ariaControls,
    onClick,
    testId,
    tooltipText,
    badge,
    selected = false,
    highContrastHeader,
  }: TriggerButtonProps,
  ref: React.Ref<ButtonProps.Ref>
) {
  const containerRef = React.useRef(null);
  const tooltipValue = tooltipText ? tooltipText : ariaLabel ?? '';
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  /**
   * This state value is set to avoid an unintended showing ot the tooltip event on focus of
   * the trigger button when the drawer is closed f
   */
  const [pointerRecentlyVisited, setPointerRecentlyVisited] = useState<boolean>(false);

  useEffect(() => {
    const close = () => {
      setShowTooltip(false);
    };

    const handlePointerDownEvent = (event: PointerEvent) => {
      if (event.target && containerRef && (containerRef.current as any)?.contains(event.target as HTMLElement)) {
        return;
      }
      close();
    };

    const handleKeyDownEvent = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('pointerdown', handlePointerDownEvent);
    window.addEventListener('keydown', handleKeyDownEvent);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDownEvent);
      window.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [containerRef, showTooltip]);

  const onShowTooltipSoft = (show: boolean) => {
    setPointerRecentlyVisited(show);
    setShowTooltip(show);
  };

  const onShowTooltipHard = (show: boolean) => {
    setShowTooltip(show);
  };

  return (
    <div
      className={clsx(styles['trigger-wrapper'], !highContrastHeader && styles['remove-high-contrast-header'])}
      ref={containerRef}
      onPointerEnter={() => onShowTooltipSoft(true)}
      onPointerLeave={() => onShowTooltipSoft(false)}
      onFocus={() => {
        if (pointerRecentlyVisited) {
          onShowTooltipHard(true);
        }
      }}
      onBlur={() => onShowTooltipHard(false)}
    >
      <button
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-haspopup={true}
        aria-label={ariaLabel}
        className={clsx(
          styles.trigger,
          {
            [styles.selected]: selected,
            [styles.badge]: badge,
          },
          className
        )}
        onClick={onClick}
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        data-testid={testId}
      >
        <span className={clsx(badge && styles['trigger-badge-wrapper'])}>
          <Icon name={iconName} svg={iconSvg} />
        </span>
      </button>
      {badge && <div className={styles.dot} />}
      {showTooltip && containerRef && containerRef.current && tooltipValue && (
        <Tooltip trackRef={containerRef} position="left" value={tooltipValue} />
      )}
    </div>
  );
}

export default React.forwardRef(TriggerButton);
