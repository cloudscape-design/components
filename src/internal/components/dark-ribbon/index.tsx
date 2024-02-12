// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import { useMutationObserver } from '../../hooks/use-mutation-observer';
import { getContentHeaderClassName } from '../../utils/content-header-utils';
import styles from './styles.css.js';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

interface DarkRibbonProps {
  children: React.ReactNode;
  isRefresh: boolean;
  hasPlainStyling?: boolean;
}

function setIfChanged(oldValue: string, newValue: string, setter: (newValue: string) => void) {
  if (oldValue !== newValue) {
    setter(newValue);
  }
}

export default function DarkRibbon({ children, isRefresh, hasPlainStyling }: DarkRibbonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const syncSizes = useStableCallback((from: HTMLElement, to: HTMLElement) => {
    // JSDOM calls mutation observer callback even if attribute did not change
    // https://github.com/jsdom/jsdom/issues/3305
    // To prevent infinite loops, we need to check the values before setting
    const size = from.getBoundingClientRect();
    const { height: oldHeight, left: oldLeft, right: oldRight } = to.style;
    setIfChanged(oldHeight, `${size.height}px`, newHeight => (to.style.height = newHeight));
    setIfChanged(oldLeft, `${-1 * size.left}px`, newLeft => (to.style.left = newLeft));
    setIfChanged(
      oldRight,
      `${-1 * (document.body.clientWidth - size.right)}px`,
      newRight => (to.style.right = newRight)
    );
  });
  useMutationObserver(containerRef, node => {
    if (fillRef.current) {
      syncSizes(node, fillRef.current);
    }
  });
  useEffect(() => {
    const handler = () => {
      if (containerRef.current && fillRef.current) {
        syncSizes(containerRef.current, fillRef.current);
      }
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [syncSizes]);

  if (hasPlainStyling === true || !isRefresh) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className={getContentHeaderClassName()}>
      <div ref={fillRef} className={styles['background-fill']} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
