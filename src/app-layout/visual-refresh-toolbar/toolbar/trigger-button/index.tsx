// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../../../../button/interfaces';
import { IconProps } from '../../../../icon/interfaces';
import Icon from '../../../../icon/internal';
import Tooltip from '../../../../internal/components/tooltip';
import { registerTooltip } from '../../../../internal/components/tooltip/registry';

import testutilStyles from '../../../test-classes/styles.css.js';
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
  hasOpenDrawer?: boolean;
  /**
   * If the AppLayout is in mobile mode
   * Used to determine if and where to render tooltips
   */
  isMobile?: boolean;
  /**
   * set to true if the trigger button was used to open the last active drawer
   * this is also used to hide the tooltip should the focus be set programmatically
   * on focus from a drawer close using this
   */
  isForPreviousActiveDrawer?: boolean;
  /**
   * if the trigger button is for the split panel
   */
  isForSplitPanel?: boolean;
  tabIndex?: number | undefined;
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
    hasTooltip = false,
    tooltipText,
    hasOpenDrawer = false,
    isMobile = false,
    isForPreviousActiveDrawer = false,
    isForSplitPanel = false,
  }: TriggerButtonProps,
  ref: React.Ref<ButtonProps.Ref>
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipValue = tooltipText ? tooltipText : ariaLabel ? ariaLabel : '';
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [suppressTooltip, setSupressTooltip] = useState<boolean>(false);

  const handleTriggerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Stop the event from propagating to the badge icon
    setShowTooltip(false);
    setSupressTooltip(true);
    onClick(event);
  };

  const handleBlur = (keepSupressed = false) => {
    setSupressTooltip(keepSupressed);
    setShowTooltip(false);
  };

  const handlePointerEnter = () => {
    setSupressTooltip(false);
    setShowTooltip(true);
  };

  /**
   * Takes the drawer being closed and the data-shift-focus value from a close button on that drawer that persists
   * on the event relatedTarget to determine not to show the tooltip
   * @param event
   */
  const handleOnFocus = useCallback(
    (event: FocusEvent) => {
      let shouldShowTooltip = false;
      const eventWithRelatedTarget = event as any;
      const relatedTarget = eventWithRelatedTarget?.relatedTarget;
      const isFromAnotherTrigger = relatedTarget?.dataset?.shiftFocus === 'awsui-layout-drawer-trigger';
      if (
        (isForSplitPanel && !!relatedTarget) || // relatedTarget is null when split panel is closed
        (!isForSplitPanel &&
          (isFromAnotherTrigger || // for key navigation from another trigger button
            !isForPreviousActiveDrawer)) // for when the drawer was not opened recently
      ) {
        shouldShowTooltip = true;
      }
      setSupressTooltip(!shouldShowTooltip);
      setShowTooltip(true);
    },
    [
      // To assert reference equality check
      isForPreviousActiveDrawer,
      isForSplitPanel,
    ]
  );

  const tooltipVisible = useMemo(() => {
    return (
      hasTooltip &&
      showTooltip &&
      !suppressTooltip &&
      !!containerRef?.current &&
      tooltipValue &&
      !(isMobile && hasOpenDrawer)
    );
  }, [hasTooltip, showTooltip, containerRef, tooltipValue, isMobile, hasOpenDrawer, suppressTooltip]);

  useEffect(() => {
    if (hasTooltip && tooltipValue) {
      const close = () => {
        setShowTooltip(false);
        setSupressTooltip(false);
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

      const wrapperDiv = containerRef.current;
      if (wrapperDiv) {
        const controller = new AbortController();
        wrapperDiv.addEventListener('pointerdown', handlePointerDownEvent, { signal: controller.signal });
        wrapperDiv.addEventListener('keydown', handleKeyDownEvent, { signal: controller.signal });

        return () => {
          controller.abort();
        };
      }
    }
  }, [containerRef, hasTooltip, tooltipValue]);

  useEffect(() => {
    if (tooltipVisible) {
      return registerTooltip(() => {
        setShowTooltip(false);
        setSupressTooltip(false);
      });
    }
  }, [tooltipVisible]);

  return (
    <div
      ref={containerRef}
      {...(hasTooltip && {
        onPointerEnter: () => handlePointerEnter(),
        onPointerLeave: () => handleBlur(true),
        onFocus: e => handleOnFocus(e as any),
        onBlur: () => handleBlur(true),
      })}
      className={styles['trigger-wrapper']}
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
          styles['trigger-button-styles'],
          {
            [styles.selected]: selected,
            [styles.badge]: badge,
            [testutilStyles['drawers-trigger-with-badge']]: badge,
          },
          className
        )}
        onClick={handleTriggerClick}
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        data-testid={testId}
        data-shift-focus="awsui-layout-drawer-trigger"
      >
        <span className={clsx(badge && clsx(styles['trigger-badge-wrapper'], styles['trigger-button-styles']))}>
          {(iconName || iconSvg) && <Icon name={iconName} svg={iconSvg} />}
        </span>
      </button>
      {badge && <div className={styles.dot} />}
      {tooltipVisible && (
        <Tooltip trackRef={containerRef} value={tooltipValue} className={testutilStyles['trigger-tooltip']} />
      )}
    </div>
  );
}

export default React.forwardRef(TriggerButton);
