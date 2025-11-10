// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import {
  GeneratedAnalyticsMetadataAppLayoutToolbarClose,
  GeneratedAnalyticsMetadataAppLayoutToolbarOpen,
} from '../../../../app-layout-toolbar/analytics-metadata/interfaces';
import { ButtonProps } from '../../../../button/interfaces';
import { InternalFeaturePrompt } from '../../../../feature-prompt/internal';
import { IconProps } from '../../../../icon/interfaces';
import Icon from '../../../../icon/internal';
import Tooltip from '../../../../internal/components/tooltip';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../../../../internal/events';

import testutilStyles from '../../../test-classes/styles.css.js';
import styles from './styles.css.js';

export interface TriggerButtonProps {
  ariaLabel?: string;
  className?: string;
  iconName?: IconProps.Name;
  iconSvg?: React.ReactNode;
  customSvg?: React.ReactNode;
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
  variant?: 'circle' | 'custom';

  featurePrompt?: {
    visible: boolean;
    onDismiss: NonCancelableEventHandler<null>;
    header?: React.ReactNode;
    content: React.ReactNode;
    dismissAriaLabel?: string;
  };
}

function TriggerButton(
  {
    ariaLabel,
    className,
    iconName,
    iconSvg,
    customSvg,
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
    variant = 'circle',
    featurePrompt,
  }: TriggerButtonProps,
  ref: React.Ref<ButtonProps.Ref>
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipValue = tooltipText ? tooltipText : ariaLabel ? ariaLabel : '';
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [suppressTooltip, setSuppressTooltip] = useState<boolean>(false);

  const handleTriggerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Stop the event from propagating to the badge icon
    setShowTooltip(false);
    setSuppressTooltip(true);
    onClick(event);
  };

  const handleBlur = (keepSuppressed = false) => {
    setSuppressTooltip(keepSuppressed);
    setShowTooltip(false);
  };

  const handlePointerEnter = () => {
    setSuppressTooltip(false);
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
      setSuppressTooltip(!shouldShowTooltip);
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
        setSuppressTooltip(false);
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

  const triggerEventMetadata:
    | GeneratedAnalyticsMetadataAppLayoutToolbarClose
    | GeneratedAnalyticsMetadataAppLayoutToolbarOpen = {
    action: selected ? 'close' : 'open',
    detail: { label: { root: 'self' } },
  };

  const trigger = (
    <button
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-haspopup={true}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      disabled={disabled}
      className={clsx(
        styles.trigger,
        styles[variant],
        {
          [styles.selected]: selected,
          [styles['trigger-with-badge']]: badge,
          [testutilStyles['drawers-trigger-with-badge']]: badge,
        },
        className
      )}
      onClick={handleTriggerClick}
      ref={ref as Ref<HTMLButtonElement>}
      type="button"
      data-testid={testId}
      data-shift-focus="awsui-layout-drawer-trigger"
      {...getAnalyticsMetadataAttribute(triggerEventMetadata)}
    >
      {customSvg ?? ((iconName || iconSvg) && <Icon name={iconName} svg={iconSvg} />)}
    </button>
  );

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
      {featurePrompt ? (
        <InternalFeaturePrompt
          {...featurePrompt}
          position="left"
          size="medium"
          fixedWidth={false}
          onDismiss={() => {
            fireNonCancelableEvent(featurePrompt.onDismiss);
            setShowTooltip(false);
          }}
        >
          {trigger}
        </InternalFeaturePrompt>
      ) : (
        trigger
      )}
      {badge && <div className={styles.dot} />}
      {tooltipVisible && !featurePrompt?.visible && (
        <Tooltip
          trackRef={containerRef}
          value={tooltipValue}
          className={testutilStyles['trigger-tooltip']}
          onDismiss={() => {
            setShowTooltip(false);
            setSuppressTooltip(false);
          }}
        />
      )}
    </div>
  );
}

export default React.forwardRef(TriggerButton);
