// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useEffect, useMemo, useState } from 'react';
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
   * If the AppLayout has a drawer that is open
   * Used to hide tooltips in certian conditions
   */
  hasOpenDrawer?: boolean;
  /**
   * If the AppLayout is in mobile mode
   * Used to determine what and where to render tooltips
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
  // {
  //   ariaLabel,
  //   className,
  //   iconName,
  //   iconSvg,
  //   ariaExpanded,
  //   ariaControls,
  //   onClick,
  //   hasTooltip = false,
  //   hideTooltipOnFocus = false,
  //   tooltipText,
  //   testId,
  //   disabled = false,
  //   badge,
  //   selected = false,
  //   highContrastHeader,
  //   hasOpenDrawer = false,
  //   isMobile = false,
  // }: TriggerButtonProps,
  props: TriggerButtonProps,
  ref: React.Ref<ButtonProps.Ref>
) {
  console.log(props);
  const {
    ariaLabel,
    className,
    iconName,
    iconSvg,
    ariaExpanded,
    ariaControls,
    onClick,
    hasTooltip = false,
    hideTooltipOnFocus = false,
    tooltipText,
    testId,
    disabled = false,
    badge,
    selected = false,
    highContrastHeader,
    hasOpenDrawer = false,
    isMobile = false,
  } = props;
  const containerRef = React.useRef(null);
  const tooltipValue = tooltipText ? tooltipText : ariaLabel ? ariaLabel : '';
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  //there is an override to used to hide the tooltip on certan programatic focus events
  const [showTooltipOverride, setShowTooltipOverride] = useState<boolean>(false);

  const onShowTooltipSoft = (show: boolean) => {
    setShowTooltipOverride(false);
    setShowTooltip(show);
  };

  const onShowTooltipHard = (show: boolean) => {
    if (!setShowTooltipOverride) {
      setShowTooltip(show);
    }
  };

  const handleOnClick = () => {
    setShowTooltipOverride(false);
    onShowTooltipHard(false);
    onClick();
  };

  const handleOnBlur = () => {
    setShowTooltipOverride(false);
    setShowTooltip(false);
  };

  const handleOnFocus = ({ relatedTarget }: Partial<FocusEvent>) => {
    console.log('focus recieved');
    if (relatedTarget !== null) {
      setShowTooltip(true);
    }
  };

  const renderTooltip = useMemo(() => {
    return hasTooltip && showTooltip && !!containerRef?.current && tooltipValue && !(isMobile && hasOpenDrawer);
  }, [hasTooltip, showTooltip, containerRef, tooltipValue, isMobile, hasOpenDrawer]);

  useEffect(() => {
    if (hasTooltip && tooltipValue) {
      const close = () => {
        setShowTooltipOverride(false);
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

  useEffect(() => {
    if (hideTooltipOnFocus && !showTooltipOverride) {
      setShowTooltipOverride(true);
    }
  }, [hideTooltipOnFocus, showTooltipOverride]);

  return (
    <div
      ref={containerRef}
      {...(hasTooltip && {
        onPointerEnter: () => onShowTooltipSoft(true),
        onPointerLeave: () => onShowTooltipSoft(false),
        onFocus: e => handleOnFocus(e),
        onBlur: () => handleOnBlur(),
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

      {renderTooltip && (
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
