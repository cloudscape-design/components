// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { Portal } from '@cloudscape-design/component-toolkit/internal';
import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import ScreenreaderOnly from '../internal/components/screenreader-only';
import { Transition } from '../internal/components/transition';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import LiveRegion from '../live-region/internal';
import PopoverArrow from '../popover/arrow';
import PopoverBody from '../popover/body';
import PopoverContainer from '../popover/container';
import { InternalTooltipProps } from './interfaces';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

type InternalTooltipComponentProps = InternalTooltipProps &
  InternalBaseComponentProps & {
    referrerId?: string;
  };

export default function InternalTooltip({
  content,
  trigger,
  triggerVariant = 'manual',
  getTrack,
  className,
  position = 'top',
  onEscape,
  referrerId,
  __internalRootRef,
  ...restProps
}: InternalTooltipComponentProps) {
  const baseProps = getBaseProps(restProps);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(triggerVariant === 'manual');
  const [isTruncated, setIsTruncated] = useState(false);

  const resolvedGetTrack = useCallback(() => (getTrack ? getTrack() : triggerRef.current), [getTrack]);

  // Truncation detection for triggerVariant="truncation"
  useResizeObserver(triggerVariant === 'truncation' ? triggerRef : { current: null }, () => {
    const el = triggerRef.current;
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  });

  const isVisible =
    triggerVariant === 'manual' || (triggerVariant === 'truncation' ? showTooltip && isTruncated : showTooltip);

  useEffect(() => {
    if (!isVisible) {
      return;
    }
    const controller = new AbortController();
    window.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          if (triggerVariant !== 'manual') {
            setShowTooltip(false);
          }
          fireNonCancelableEvent(onEscape);
        }
      },
      { capture: true, signal: controller.signal }
    );
    return () => controller.abort();
  }, [isVisible, onEscape, triggerVariant]);

  const triggerHandlers =
    triggerVariant !== 'manual'
      ? {
          onMouseEnter: () => setShowTooltip(true),
          onMouseLeave: () => setShowTooltip(false),
          onFocus: () => setShowTooltip(true),
          onBlur: () => setShowTooltip(false),
        }
      : {};

  const triggerAriaProps: React.HTMLAttributes<HTMLSpanElement> = {};
  if (triggerVariant === 'group') {
    triggerAriaProps.role = 'group';
  }

  const tooltipContent =
    triggerVariant === 'announcement' || triggerVariant === 'truncation' ? <LiveRegion>{content}</LiveRegion> : content;

  const renderTooltipPopover = () => (
    <Portal>
      <div
        {...baseProps}
        className={clsx(testUtilStyles.root, baseProps.className)}
        ref={trigger ? undefined : __internalRootRef}
        data-awsui-referrer-id={referrerId}
        role="tooltip"
      >
        <Transition in={true}>
          {() => (
            <PopoverContainer
              getTrack={resolvedGetTrack}
              size="medium"
              fixedWidth={false}
              position={position}
              zIndex={7000}
              arrow={position => <PopoverArrow position={position} />}
              hideOnOverscroll={true}
              className={className}
            >
              <PopoverBody dismissButton={false} dismissAriaLabel={undefined} onDismiss={undefined} header={undefined}>
                {tooltipContent}
              </PopoverBody>
            </PopoverContainer>
          )}
        </Transition>
      </div>
    </Portal>
  );

  // When trigger is provided, render the trigger wrapper with tooltip
  if (trigger !== undefined) {
    return (
      <span
        ref={node => {
          (triggerRef as React.MutableRefObject<HTMLSpanElement | null>).current = node;
          if (__internalRootRef) {
            if (typeof __internalRootRef === 'function') {
              __internalRootRef(node);
            } else {
              (__internalRootRef as React.MutableRefObject<HTMLElement | null>).current = node;
            }
          }
        }}
        className={clsx(styles.trigger, triggerVariant === 'truncation' && styles['trigger-truncation'])}
        tabIndex={
          triggerVariant === 'truncation' ? (isTruncated ? 0 : undefined) : triggerVariant !== 'manual' ? 0 : undefined
        }
        {...triggerHandlers}
        {...triggerAriaProps}
      >
        {trigger}
        {triggerVariant === 'group' && <ScreenreaderOnly>{content}</ScreenreaderOnly>}
        {isVisible && renderTooltipPopover()}
      </span>
    );
  }

  // Original behavior: no trigger, just render the tooltip popover directly
  if (!isVisible) {
    return null;
  }
  return renderTooltipPopover();
}
