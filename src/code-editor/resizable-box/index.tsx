// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import InternalDragHandle from '../../internal/components/drag-handle/index.js';
import DragHandleWrapper from '../../internal/components/drag-handle-wrapper/index.js';

import styles from './styles.css.js';

const KEYBOARD_STEP_SIZE = 20;

export interface ResizeBoxProps {
  children: React.ReactNode;
  height: number;
  minHeight: number;
  onResize: (newHeight: number) => void;
}

export function ResizableBox({ children, height, minHeight, onResize }: ResizeBoxProps) {
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
        onResizeStable(height + KEYBOARD_STEP_SIZE);
        break;
      case 'ArrowUp':
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
        <DragHandleWrapper
          onPress={direction => {
            onResizeStable(
              Math.max(height + (direction === 'block-start' ? -1 * KEYBOARD_STEP_SIZE : KEYBOARD_STEP_SIZE), minHeight)
            );
          }}
          resizeTooltipText="Drag or select to move" // TODO: fixme!
          buttonLabels={{
            'block-start': 'Reduce size',
            'block-end': 'Increase size',
          }} // TODO: fixme!
          directions={{
            'block-start': height > minHeight ? 'active' : 'disabled',
            'block-end': 'active',
          }}
        >
          <InternalDragHandle
            ariaLabel="Resize handle"
            variant="resize-area"
            ariaValue={{ valueMin: minHeight, valueMax: 999999999, valueNow: height }}
            onPointerDown={onPointerDown}
            onKeyDown={onKeyDown}
          />
        </DragHandleWrapper>
      </div>
    </div>
  );
}
