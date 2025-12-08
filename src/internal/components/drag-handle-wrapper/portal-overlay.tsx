// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import {
  getIsRtl,
  getLogicalBoundingClientRect,
  getScrollInlineStart,
  Portal,
} from '@cloudscape-design/component-toolkit/internal';

import styles from './styles.css.js';

export default function PortalOverlay({
  track,
  isDisabled,
  children,
}: {
  track: React.RefObject<HTMLElement | null>;
  isDisabled: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (track.current) {
      const newContainer = track.current.ownerDocument.createElement('div');
      track.current.ownerDocument.body.appendChild(newContainer);
      setContainer(newContainer);
      return () => newContainer.remove();
    }
  }, [track]);

  useEffect(() => {
    if (track.current === null || isDisabled) {
      return;
    }

    let cleanedUp = false;
    let lastX: number | undefined;
    let lastY: number | undefined;
    let lastInlineSize: number | undefined;
    let lastBlockSize: number | undefined;
    const updateElement = () => {
      // It could be that the portal hasn't been attached to the DOM yet - ensure the ref exists and is attached DOM tree.
      if (track.current && ref.current && document.body.contains(ref.current)) {
        const isRtl = getIsRtl(ref.current);
        const { insetInlineStart, insetBlockStart, inlineSize, blockSize } = getLogicalBoundingClientRect(
          track.current
        );
        // For simplicity, we just make all our calculations independent of
        // the browser's scrolling edge. When it comes to applying the changes,
        // translate is independent of writing direction, so we need to invert
        // the X coordinate ourselves just before applying the values.
        const newX = (insetInlineStart + getScrollInlineStart(document.documentElement)) * (isRtl ? -1 : 1);
        const newY = insetBlockStart + document.documentElement.scrollTop;
        if (lastX !== newX || lastY !== newY) {
          ref.current.style.translate = `${newX}px ${newY}px`;
          lastX = newX;
          lastY = newY;
        }
        if (lastInlineSize !== inlineSize || lastBlockSize !== blockSize) {
          ref.current.style.width = `${inlineSize}px`;
          ref.current.style.height = `${blockSize}px`;
          lastInlineSize = inlineSize;
          lastBlockSize = blockSize;
        }
      }
      if (!cleanedUp) {
        requestAnimationFrame(updateElement);
      }
    };
    updateElement();

    return () => {
      cleanedUp = true;
    };
  }, [isDisabled, track]);

  return (
    <Portal container={container}>
      <span ref={ref} className={clsx(styles['portal-overlay'], isDisabled && styles['portal-overlay-disabled'])}>
        <span className={styles['portal-overlay-contents']}>{children}</span>
      </span>
    </Portal>
  );
}
