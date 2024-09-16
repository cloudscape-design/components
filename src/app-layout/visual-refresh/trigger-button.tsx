// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../../button/interfaces';
import { InternalButton } from '../../button/internal';
import { IconProps } from '../../icon/interfaces';
import Icon from '../../icon/internal';
import Tooltip from '../../internal/components/tooltip';
import { registerTooltip } from '../../internal/components/tooltip/registry';
import { useAppLayoutInternals } from './context';

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
   * If button is selected. Used only for desktop and applies a selected class for desktop. Mobile does not need the class as the trigger buttons are hidden by the open drawer
   */
  selected?: boolean;
  onClick: () => void;
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
   * set to true if the trigger button was used to open the last active drawer
   */
  isForPreviousActiveDrawer?: boolean;
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
    tooltipText = '',
    isForPreviousActiveDrawer = false,
  }: TriggerButtonProps,
  ref: React.Ref<ButtonProps.Ref>
) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const tooltipValue = tooltipText ? tooltipText : ariaLabel ? ariaLabel : '';
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [suppressTooltip, setSupressTooltip] = useState<boolean>(false);
  const { hasOpenDrawer, isMobile } = useAppLayoutInternals();

  const tooltipVisible =
    containerRef &&
    containerRef?.current &&
    tooltipValue &&
    !(isMobile && hasOpenDrawer) &&
    showTooltip &&
    !suppressTooltip;

  /**
   * Takes the drawer being closed and the data-shift-focus value from a close button on that drawer that persists
   * on the event relatedTarget to determine not to show the tooltip
   * @param event
   */
  const handleFocus = useCallback(
    (event: FocusEvent) => {
      const eventWithRelatedTarget = event as any;

      // condition for showing the tooltip hard into a separate function
      const shouldShowTooltip = () => {
        const isFromDrawer =
          eventWithRelatedTarget?.relatedTarget?.dataset?.shiftFocus === 'last-opened-toolbar-trigger-button';
        const isFromAnotherTrigger =
          eventWithRelatedTarget?.relatedTarget?.dataset?.shiftFocus === 'awsui-layout-drawer-trigger';

        if (isForPreviousActiveDrawer) {
          //needed for safari which doesn't read the relatedTarget when drawer closed via
          //drawer close button
          if (
            isFromAnotherTrigger ||
            selected //neccessary in VR mode because tab navigation from close to 1st trigger button
          ) {
            return true;
          }
          return false;
        }
        return !isFromDrawer; //for keyed navigation inside the toolbar
      };

      setSupressTooltip(!shouldShowTooltip());
      setShowTooltip(true);
    },
    [
      // To assert reference equality check
      isForPreviousActiveDrawer,
      selected,
    ]
  );

  const handleClick = (event: MouseEvent) => {
    setSupressTooltip(true);
    onClick();
    event.stopPropagation();
  };

  const handleBlur = (keepSupressed = false) => {
    setSupressTooltip(keepSupressed);
    setShowTooltip(false);
  };

  const handleMouseEnter = () => {
    setSupressTooltip(false);
    setShowTooltip(true);
  };

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
        wrapperDiv.addEventListener('pointerdown', handlePointerDownEvent);
        wrapperDiv.addEventListener('keydown', handleKeyDownEvent);

        return () => {
          wrapperDiv.removeEventListener('pointerdown', handlePointerDownEvent);
          wrapperDiv.removeEventListener('keydown', handleKeyDownEvent);
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
        onPointerEnter: () => handleMouseEnter(),
        onPointerLeave: () => handleBlur(false),
        onFocus: e => handleFocus(e as any),
        onBlur: () => handleBlur(true),
        onMouseLeave: () => handleBlur(false),
        onMouseEnter: () => handleMouseEnter(),
      })}
      className={clsx(styles['trigger-wrapper'], {
        [styles['remove-high-contrast-header']]: !highContrastHeader,
        [styles['trigger-wrapper-tooltip-visible']]: tooltipVisible,
      })}
    >
      {isMobile ? (
        <InternalButton
          ariaExpanded={ariaExpanded}
          ariaLabel={ariaLabel}
          ariaControls={ariaControls}
          className={className}
          disabled={disabled}
          ref={ref}
          formAction="none"
          iconName={iconName}
          iconSvg={iconSvg}
          badge={badge}
          onClick={e => handleClick(e as any)}
          variant="icon"
          __nativeAttributes={{
            'aria-haspopup': true,
            ...(testId && {
              'data-testid': testId,
              'data-shift-focus': 'awsui-layout-drawer-trigger',
            }),
          }}
        />
      ) : (
        <>
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
            onClick={e => handleClick(e as any)}
            ref={ref as Ref<HTMLButtonElement>}
            type="button"
            data-testid={testId}
            data-shift-focus="awsui-layout-drawer-trigger"
          >
            <span className={clsx(badge && styles['trigger-badge-wrapper'])}>
              {(iconName || iconSvg) && <Icon name={iconName} svg={iconSvg} />}
            </span>
          </button>
          {badge && <div className={styles.dot} />}
        </>
      )}
      {tooltipVisible && (
        <Tooltip
          trackRef={containerRef}
          value={tooltipValue}
          className={styles['trigger-tooltip']}
          {...(!isMobile && { position: 'left' })}
        />
      )}
    </div>
  );
}

export default React.forwardRef(TriggerButton);
