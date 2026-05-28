// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { HTMLAttributes, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import Tooltip from '../tooltip/internal';
import { TruncatedTextProps } from './interfaces';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

type InternalTruncatedTextProps = TruncatedTextProps & InternalBaseComponentProps;

export default function InternalTruncatedText({
  children,
  tooltipText,
  __internalRootRef,
  ...rest
}: InternalTruncatedTextProps) {
  const baseProps = getBaseProps(rest);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  useResizeObserver(containerRef, () => {
    const element = containerRef.current;
    if (element) {
      // The element uses CSS ellipsis truncation. When the rendered content overflows the
      // visible box, the browser sets scrollWidth > clientWidth.
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  });

  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      // useResizeObserver fires initially at layoutEffect-time where the initial calculation
      // is performed, but the calculation isn't always correct at that stage.
      setTimeout(() => setIsTruncated(element.scrollWidth > element.clientWidth), 1);
    }
  }, []);

  const tooltipEnabledProps: HTMLAttributes<HTMLSpanElement> = isTruncated
    ? {
        role: 'group',
        tabIndex: 0,
        onPointerEnter: () => setShowTooltip(true),
        onPointerLeave: () => setShowTooltip(false),
        // onFocus/onBlur bubble in React, so we only want the wrapper focus to trigger the tooltip.
        onFocus: event => event.target === event.currentTarget && setShowTooltip(true),
        onBlur: event => event.target === event.currentTarget && setShowTooltip(false),
      }
    : {};

  return (
    <>
      <span
        {...baseProps}
        {...tooltipEnabledProps}
        ref={useMergeRefs(__internalRootRef, containerRef)}
        className={clsx(styles.root, testUtilStyles.root, baseProps.className)}
      >
        {children}
        {isTruncated && showTooltip && (
          <Tooltip
            content={tooltipText ?? children}
            getTrack={() => containerRef.current}
            onEscape={() => setShowTooltip(false)}
          />
        )}
      </span>
    </>
  );
}
