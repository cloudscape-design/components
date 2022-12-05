// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @cloudscape-design/prefer-live-region */

import React, { memo, useEffect, useRef } from 'react';
import { ScreenreaderOnlyProps } from '../screenreader-only';
import { updateLiveRegion } from './utils';
import AriaLiveTag from './aria-liva-tag';

export interface LiveRegionProps extends ScreenreaderOnlyProps {
  assertive?: boolean;
  delay?: number;
  visible?: boolean;
  children: React.ReactNode;
}

/**
 * The live region is hidden in the layout, but visible for screen readers.
 * It's purpose it to announce changes e.g. when custom navigation logic is used.
 *
 * The way live region works differently in different browsers and screen readers and
 * it is recommended to manually test every new implementation.
 *
 * If you notice there are different words being merged together,
 * check if there are text nodes not being wrapped in elements, like:
 * <LiveRegion>
 *   {title}
 *   <span><Details /></span>
 * </LiveRegion>
 *
 * To fix, wrap "title" in an element:
 * <LiveRegion>
 *   <span>{title}</span>
 *   <span><Details /></span>
 * </LiveRegion>
 *
 * Or create a single text node if possible:
 * <LiveRegion>
 *   {`${title} ${details}`}
 * </LiveRegion>
 *
 * The live region is always atomic, because non-atomic regions can be treated by screen readers
 * differently and produce unexpected results. To imitate non-atomic announcements simply use
 * multiple live regions:
 * <>
 *   <LiveRegion>{title}</LiveRegion>
 *   <LiveRegion><Details /></LiveRegion>
 * </>
 */
export default memo(LiveRegion);

function LiveRegion({ delay = 10, children, ...restProps }: LiveRegionProps) {
  const sourceRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef<HTMLSpanElement>(null);

  /*
    When React state changes, React often produces too many DOM updates, causing NVDA to
    issue many announcements for the same logical event (See https://github.com/nvaccess/nvda/issues/7996).

    The code below imitates a debouncing, scheduling a callback every time new React state
    update is detected. When a callback resolves, it copies content from a muted element
    to the live region, which is recognized by screen readers as an update.

    If the use case requires no announcement to be ignored, use delay = 0, but ensure it
    does not impact the performance. If it does, prefer using a string as children prop.
  */
  useEffect(() => {
    let timeoutId: null | number;
    if (delay) {
      timeoutId = setTimeout(() => updateLiveRegion(targetRef, sourceRef), delay);
    } else {
      updateLiveRegion(targetRef, sourceRef);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  });

  return (
    <AriaLiveTag targetRef={targetRef} sourceRef={sourceRef} {...restProps}>
      {children}
    </AriaLiveTag>
  );
}
