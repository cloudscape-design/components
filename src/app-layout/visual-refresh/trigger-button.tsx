// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useEffect, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../../button/interfaces';
import { InternalButton } from '../../button/internal';
import { IconProps } from '../../icon/interfaces';
import Icon from '../../icon/internal';
import Tooltip from '../../internal/components/tooltip';

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
  /**
   * Set to true if this component used in a mobile layout
   *
   * It will then render a different InternalButton that is optimumn for the mobile experience
   */
  isMobile?: boolean;
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
    isMobile = false,
    badge,
    selected = false,
    highContrastHeader,
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

  useEffect(() => {
    if (showTooltip) {
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
  }, [containerRef, showTooltip]);

  return (
    <div
      ref={containerRef}
      {...(hasTooltip
        ? {
            onPointerEnter: () => onShowTooltipSoft(true),
            onPointerLeave: () => onShowTooltipSoft(false),
            onFocus: ({ target, currentTarget }) => {
              if (currentTarget === target) {
                onShowTooltipHard(true);
              }
            },
            onBlur: () => onShowTooltipHard(false),
          }
        : {})}
      data-testid={`${testId ? `${testId}-wrapper` : 'awsui-app-layout-trigger-wrapper'}${hasTooltip ? '-with-possible-tooltip' : ''}`}
      className={clsx(styles['trigger-wrapper'], !highContrastHeader && styles['remove-high-contrast-header'])}
    >
      {isMobile ? (
        <InternalButton
          ariaExpanded={ariaExpanded}
          ariaLabel={ariaLabel}
          className={className}
          disabled={disabled}
          ref={ref}
          formAction="none"
          iconName={iconName}
          iconSvg={iconSvg}
          badge={badge}
          onClick={onClick}
          variant="icon"
          __nativeAttributes={{
            'aria-haspopup': true,
            ...(testId
              ? {
                  'data-testid': testId,
                }
              : {}),
          }}
        />
      ) : (
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
          onClick={onClick}
          ref={ref as Ref<HTMLButtonElement>}
          type="button"
          data-testid={testId}
        >
          <span className={clsx(badge && styles['trigger-badge-wrapper'])}>
            {(iconName || iconSvg) && <Icon name={iconName} svg={iconSvg} />}
          </span>
        </button>
      )}
      {badge && <div className={styles.dot} />}
      {showTooltip && containerRef && containerRef.current && tooltipValue && (
        <Tooltip trackRef={containerRef} position="left" value={tooltipValue} className={styles['trigger-tooltip']} />
      )}
    </div>
  );
}

export default React.forwardRef(TriggerButton);
