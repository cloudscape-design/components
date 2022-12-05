// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { memo, useEffect, useMemo, useRef } from 'react';
import { throttle } from '../../utils/throttle';
import { ScreenreaderOnlyProps } from '../screenreader-only';
import { updateLiveRegion } from '../live-region/utils';
import AriaLiveTag from '../live-region/aria-liva-tag';

export interface DynamicAriaLiveProps extends ScreenreaderOnlyProps {
  assertive?: boolean;
  delay?: number;
  children: React.ReactNode;
}

/**
 * Dynamic aria live component is hidden in the layout, but visible for screen readers.
 * Purpose of this component is to announce recurring changes for a content.
 *
 * To avoid merging words, provide all text nodes wrapped with elements, like:
 * <LiveRegion>
 *   <span>{title}</span>
 *   <span><Details /></span>
 * </LiveRegion>
 * Or create a single text node if possible:
 * <LiveRegion>
 *   {`${title} ${details}`}
 * </LiveRegion>
 *
 * @param delay time value in milliseconds to set minimal time interval between announcements.
 * @param assertive determine aria-live priority. Given value == false, aria-live have `polite` attribute value.
 */
export default memo(DynamicAriaLive);

function DynamicAriaLive({ delay = 5000, children, ...restProps }: DynamicAriaLiveProps) {
  const sourceRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef<HTMLSpanElement>(null);

  const throttledUpdate = useMemo(() => {
    return throttle(() => updateLiveRegion(targetRef, sourceRef), delay);
  }, [delay]);

  useEffect(() => {
    throttledUpdate();
  });

  return (
    <AriaLiveTag targetRef={targetRef} sourceRef={sourceRef} {...restProps}>
      {children}
    </AriaLiveTag>
  );
}
