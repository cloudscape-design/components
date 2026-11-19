// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import InternalDragHandle from '../../internal/components/drag-handle';

import styles from './styles.css.js';

const KEYBOARD_STEP_SIZE = 20;

export interface ResizeBoxProps {
  children: React.ReactNode;
  height: number;
  minHeight: number;
  onResize: (newHeight: number) => void;

  handleAriaLabel?: string;
  handleTooltipText?: string;
}

export function ResizableBox({
  children,
  height,
  minHeight,
  onResize,
  handleAriaLabel,
  handleTooltipText,
}: ResizeBoxProps) {
  const [dragOffset, setDragOffset] = useState<null | number>(null);
  const onResizeStable = useStableCallback(onResize);
  const containerRef = useRef<HTMLDivElement>(null);

  const onPointerDown: React.PointerEventHandler = event => {
    if ((event.pointerType === 'mouse' && event.button !== 0) || !containerRef.current) {
      return;
    }
    const containerBottom = containerRef.current.getBoundingClientRect().bottom;
    setDragOffset(containerBottom - event.clientY);
  };

  const onKeyDown: React.KeyboardEventHandler = event => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault(); // Prevent page scroll
        onResizeStable(height + KEYBOARD_STEP_SIZE);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault(); // Prevent page scroll
        onResizeStable(Math.max(height - KEYBOARD_STEP_SIZE, minHeight));
        break;
    }
  };

  useEffect(() => {
    if (dragOffset === null || !containerRef.current) {
      return;
    }
    const container = containerRef.current;

    const onPointerMove = (event: PointerEvent) => {
      const { top } = container.getBoundingClientRect();
      const cursor = event.clientY;
      onResizeStable(Math.max(cursor + dragOffset - top, minHeight));
    };
    const onPointerUp = () => {
      setDragOffset(null);
    };
    const controller = new AbortController();
    document.body.classList.add(styles['resize-active']);
    container.classList.add(styles['cursor-active']);
    document.addEventListener('pointermove', onPointerMove, { signal: controller.signal });
    document.addEventListener('pointerup', onPointerUp, { signal: controller.signal });
    return () => {
      controller.abort();
      document.body.classList.remove(styles['resize-active']);
      container.classList.remove(styles['cursor-active']);
    };
  }, [dragOffset, minHeight, onResizeStable]);

  return (
    <div ref={containerRef} className={styles['resizable-box']} style={{ height }}>
      {children}

      <div className={styles['resizable-box-handle']}>
        <InternalDragHandle
          ariaLabel={handleAriaLabel}
          variant="resize-area"
          // Provide an arbitrary large value to valueMax since the editor can be
          // resized to be infinitely large.
          ariaValue={{ valueMin: minHeight, valueMax: 1000000, valueNow: height }}
          tooltipText={handleTooltipText}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
          directions={{
            'block-start': height > minHeight ? 'active' : 'disabled',
            'block-end': 'active',
          }}
          onDirectionClick={direction => {
            switch (direction) {
              case 'block-end':
                onResizeStable(height + KEYBOARD_STEP_SIZE);
                break;
              case 'block-start':
                onResizeStable(Math.max(height - KEYBOARD_STEP_SIZE, minHeight));
                break;
            }
          }}
        />
      </div>
    </div>
  );
}
