// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../../../../button/interfaces';
import { IconProps } from '../../../../icon/interfaces';
import Icon from '../../../../icon/internal';
import Tooltip from '../../../../internal/components/tooltip';

import styles from './styles.css.js';

export interface TriggerButtonProps {
  ariaLabel?: string;
  className?: string;
  /**
   * The name of the Icon.
   *
   * An icon is neccessary for this component to render. If the name is not given there must be a iconSvg prop passed or the component will not render
   */
  iconName?: IconProps.Name;
  /**
   * A svg node for a custom icon.
   *
   * An icon is neccessary for this component to render. If the SVG is not given there must be a iconName prop passed or the component will not render
   */
  iconSvg?: React.ReactNode;
  ariaExpanded: boolean | undefined;
  ariaControls?: string;
  disabled?: boolean;
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
   * Ovewrwrites any internal testIds when provided
   */
  testId?: string;
  /**
   * If button is selected. Used only for desktop and applies a selected class
   */
  selected?: boolean;
  onClick: () => void;
  badge?: boolean;
  highContrastHeader?: boolean;
  /**
   * set to true if the trigger button was used to open the last active drawer
   */
  isForPreviousActiveDrawer?: boolean;
  /**
   * If the AppLayout has a drawer that is open
   * Used to hide tooltips in certian conditions
   */
  hasOpenDrawer?: boolean;
  /**
   * If the AppLayout is in mobile mode
   * Used to determine what and where to render tooltips
   */
  isMobile?: boolean;
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
    hasTooltip = false,
    tooltipText,
    testId,
    disabled = false,
    badge,
    selected = false,
    highContrastHeader,
    isForPreviousActiveDrawer = false,
    hasOpenDrawer = false,
    isMobile = false,
  }: TriggerButtonProps,
  ref: React.Ref<ButtonProps.Ref>
) {
  const containerRef = React.useRef(null);
  const tooltipValue = tooltipText ? tooltipText : ariaLabel ? ariaLabel : '';
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const onShowTooltipSoft = (show: boolean) => {
    setShowTooltip(show);
  };

  const onShowTooltipHard = (show: boolean) => {
    setShowTooltip(show);
  };

  /**
   * Takes the drawer being closed and the data-shift-focus value from a close button on that drawer that persists
   * on the event relatedTarget to determine not to show the tooltip
   * @param event
   */
  const handleFocus = useCallback(
    (event: KeyboardEvent | PointerEvent) => {
      // Create a more descriptive variable name for the event object
      const eventWithRelatedTarget = event as any;

      // Extract the condition for showing the tooltip hard into a separate function
      const shouldShowTooltipHard = () => {
        return eventWithRelatedTarget?.relatedTarget?.dataset?.shiftFocus !== 'last-opened-toolbar-trigger-button';
      };

      // Extract the condition for mobile devices and open drawers into a separate function
      const isMobileWithOpenDrawerCondition = () => {
        return isMobile && (!hasOpenDrawer || isForPreviousActiveDrawer);
      };

      // Handle the logic based on the extracted conditions
      if (isMobileWithOpenDrawerCondition()) {
        if (shouldShowTooltipHard()) {
          onShowTooltipHard(true);
        } else {
          // This removes any tooltip that is already showing
          onShowTooltipHard(false);
        }
      } else if (shouldShowTooltipHard()) {
        onShowTooltipHard(true);
      } else {
        // This removes any tooltip that is already showing
        onShowTooltipHard(false);
      }
    },
    [
      // To assert reference equality check
      isMobile,
      hasOpenDrawer,
      isForPreviousActiveDrawer,
    ]
  );

  const handleOnClick = () => {
    onShowTooltipHard(false);
    onClick();
  };

  useEffect(() => {
    if (hasTooltip && tooltipValue) {
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
    }
  }, [containerRef, hasTooltip, tooltipValue]);

  return (
    <div
      ref={containerRef}
      {...(hasTooltip && {
        onPointerEnter: () => onShowTooltipSoft(true),
        onPointerLeave: () => onShowTooltipSoft(false),
        onFocus: e => handleFocus(e as any),
        onBlur: () => onShowTooltipHard(false),
      })}
      data-testid={`${testId ? `${testId}-wrapper` : 'awsui-app-layout-trigger-wrapper'}${hasTooltip ? '-with-possible-tooltip' : ''}`}
      className={clsx(styles['trigger-wrapper'], !highContrastHeader && styles['remove-high-contrast-header'])}
    >
      <button
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-haspopup={true}
        aria-label={ariaLabel}
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

      {showTooltip && containerRef && containerRef.current && tooltipValue && !(isMobile && hasOpenDrawer) && (
        <Tooltip
          trackRef={containerRef}
          value={tooltipValue}
          data-testid={'awsui-app-layout-drawer-trigger-tooltip'}
          className={styles['trigger-tooltip']}
        />
      )}
    </div>
  );
}

export default React.forwardRef(TriggerButton);
