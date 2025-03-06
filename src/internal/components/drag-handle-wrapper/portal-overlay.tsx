// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import Portal from '../portal';

import styles from './styles.css.js';

export default function PortalOverlay({ track, children }: { track: HTMLElement | null; children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (track === null) {
      return;
    }

    let cleanedUp = false;
    let lastX = -1;
    let lastY = -1;
    let lastWidth = -1;
    let lastHeight = -1;
    const updateElement = () => {
      if (ref.current) {
        const { x, y, width: newWidth, height: newHeight } = track.getBoundingClientRect();
        const newX = x + window.scrollX;
        const newY = y + window.scrollY;
        if (lastX !== newX || lastY !== newY) {
          ref.current.style.translate = `${newX}px ${newY}px`;
          lastX = newX;
          lastY = newY;
        }
        if (lastWidth !== newWidth || lastHeight !== newHeight) {
          ref.current.style.width = `${newWidth}px`;
          ref.current.style.height = `${newHeight}px`;
          lastWidth = newWidth;
          lastHeight = newHeight;
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
  }, [track]);

  if (track === null) {
    return null;
  }

  return (
    <Portal>
      <span ref={ref} className={styles['portal-overlay']}>
        <span className={styles['portal-overlay-contents']}>{children}</span>
      </span>
    </Portal>
  );
}
