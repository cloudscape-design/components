// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../../../../button/interfaces';
import { IconProps } from '../../../../icon/interfaces';
import Icon from '../../../../icon/internal';
import Tooltip from '../../../../internal/components/tooltip';

import styles from './styles.css.js';

export interface TriggerButtonProps {
  ariaLabel?: string;
  className?: string;
  iconName?: IconProps.Name;
  iconSvg?: React.ReactNode;
  ariaExpanded: boolean | undefined;
  ariaControls?: string;
  disabled?: boolean;
  /**
   * Ovewrwrites any internal testIds when provided
   */
  testId?: string;
  /**
   * If button is selected. Used only for desktop and applies a selected class
   */
  selected?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  badge?: boolean;
  highContrastHeader?: boolean;
  /**
   * If the button is expected to have a tooltip. When false it will not set the event listeners
   *
   * defaults to false
   */
  hasTooltip?: boolean;
  /**
   * This text allows for a customized tooltip.
   *
   * When falsy, the tooltip will parse the tooltip form the aria-lable
   */
  tooltipText?: string;
  /**
   * If the AppLayout has a drawer that is open
   * Used to hide tooltips in certian conditions
   */
  /**
   * set to true if the trigger button was used to open the last active drawer
   */
  isForPreviousActiveDrawer?: boolean;
  hasOpenDrawer?: boolean;
  /**
   * If the AppLayout is in mobile mode
   * Used to determine if and where to render tooltips
   */
  isMobile?: boolean;
  /**
   * @prop {boolean} [disableTooltipOnProgrammaticFocus]
   * Determines whether the tooltip should be hidden or disabled when the button
   * receives focus due to a programmatic event or trigger, rather than user
   * interaction (e.g., mouse hover or keyboard focus).
   *
   * When set to `true`, the tooltip will not be displayed if the button is focused
   * programmatically, for example, by calling the `focus()` method on the button
   * element from JavaScript code.
   *
   * This prop can be useful in situations where you want to prevent the tooltip
   * from appearing when the focus is set on the button as a result of some
   * programmatic logic or event, rather than user-initiated actions.
   *
   * If not provided or set to `false`, the tooltip will behave as usual and
   * be displayed on both user-initiated focus and programmatic focus events.
   */
  hideTooltipOnFocus?: boolean;
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
    disabled = false,
    badge,
    selected = false,
    highContrastHeader,
    hasTooltip = false,
    // hideTooltipOnFocus = false,
    tooltipText,
    // isForPreviousActiveDrawer = false,
    hasOpenDrawer = false,
    isMobile = false,
  }: TriggerButtonProps,
  ref: React.Ref<ButtonProps.Ref>
) {
  const containerRef = useRef(null);
  const tooltipValue = tooltipText ? tooltipText : ariaLabel ? ariaLabel : '';
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowTooltip(false);
    onClick(event);
  };

  const handleOnFocus = useCallback(
    (event: KeyboardEvent | PointerEvent) => {
      const eventWithRelatedTarget = event as any;

      // condition for showing the tooltip hard into a separate function
      const shouldShowTooltip = () => {
        return eventWithRelatedTarget?.relatedTarget !== null;
      };

      if (shouldShowTooltip()) {
        setShowTooltip(true);
      }
    },
    [
      // hideTooltipOnFocus,
      // isForPreviousActiveDrawer
    ]
  );

  const tooltipVisible = useMemo(() => {
    return hasTooltip && showTooltip && !!containerRef?.current && tooltipValue && !(isMobile && hasOpenDrawer);
  }, [hasTooltip, showTooltip, containerRef, tooltipValue, isMobile, hasOpenDrawer]);

  useEffect(() => {
    if (hasTooltip && tooltipValue) {
      const close = () => {
        setShowTooltip(false);
      };

      const shouldCloseTooltip = (event: PointerEvent) => {
        if (event.target && containerRef && (containerRef.current as any)?.contains(event.target as HTMLElement)) {
          return false;
        }
        return true;
      };

      const handlePointerDownEvent = (event: PointerEvent) => {
        if (shouldCloseTooltip(event)) {
          close();
        }
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
    }
  }, [containerRef, hasTooltip, tooltipValue]);

  return (
    <div
      ref={containerRef}
      {...(hasTooltip && {
        onPointerEnter: () => setShowTooltip(true),
        onPointerLeave: () => setShowTooltip(false),
        onFocus: e => handleOnFocus(e as any),
        onBlur: () => setShowTooltip(false),
      })}
      className={clsx(styles['trigger-wrapper'], !highContrastHeader ? styles['remove-high-contrast-header'] : '', {
        [styles['trigger-wrapper-tooltip-visible']]: tooltipVisible,
      })}
    >
      <button
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-haspopup={true}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        disabled={disabled}
        className={clsx(
          styles.trigger,
          {
            [styles.selected]: selected,
            [styles.badge]: badge,
          },
          className
        )}
        onClick={handleOnClick}
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        data-testid={testId}
      >
        <span className={clsx(badge && styles['trigger-badge-wrapper'])}>
          {(iconName || iconSvg) && <Icon name={iconName} svg={iconSvg} />}
        </span>
      </button>
      {badge && <div className={styles.dot} />}
      {tooltipVisible && <Tooltip trackRef={containerRef} value={tooltipValue} className={styles['trigger-tooltip']} />}
    </div>
  );
}

export default React.forwardRef(TriggerButton);
