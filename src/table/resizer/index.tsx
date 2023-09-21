// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.css.js';
import { KeyCode } from '../../internal/keycode';
import { DEFAULT_COLUMN_WIDTH } from '../use-column-widths';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { getHeaderWidth, getResizerElements } from './resizer-lookup';

interface ResizerProps {
  onWidthUpdate: (newWidth: number) => void;
  onWidthUpdateCommit: () => void;
  ariaLabelledby?: string;
  minWidth?: number;
  tabIndex?: number;
  focusId?: string;
  showFocusRing?: boolean;
}

const AUTO_GROW_START_TIME = 10;
const AUTO_GROW_INTERVAL = 10;
const AUTO_GROW_INCREMENT = 5;

export function Resizer({
  onWidthUpdate,
  onWidthUpdateCommit,
  ariaLabelledby,
  minWidth = DEFAULT_COLUMN_WIDTH,
  tabIndex,
  showFocusRing,
  focusId,
}: ResizerProps) {
  onWidthUpdate = useStableCallback(onWidthUpdate);
  onWidthUpdateCommit = useStableCallback(onWidthUpdateCommit);

  const resizerRef = useRef<HTMLSpanElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const autoGrowTimeout = useRef<ReturnType<typeof setTimeout> | undefined>();
  const [resizerHasFocus, setResizerHasFocus] = useState(false);
  const [headerCellWidth, setHeaderCellWidth] = useState(0);

  // Read header width after mounting for it to be available in the element's ARIA label before it gets focused.
  useEffect(() => {
    setHeaderCellWidth(getHeaderWidth(resizerRef.current));
  }, []);

  useEffect(() => {
    const elements = getResizerElements(resizerRef.current);
    if ((!isDragging && !resizerHasFocus) || !elements) {
      return;
    }

    const { left: leftEdge, right: rightEdge } = elements.scrollParent.getBoundingClientRect();

    const updateTrackerPosition = (newOffset: number) => {
      const { left: scrollParentLeft } = elements.table.getBoundingClientRect();
      elements.tracker.style.top = elements.header.getBoundingClientRect().height + 'px';
      // minus one pixel to offset the cell border
      elements.tracker.style.left = newOffset - scrollParentLeft - 1 + 'px';
    };

    const updateColumnWidth = (newWidth: number) => {
      const { right, width } = elements.header.getBoundingClientRect();
      const updatedWidth = newWidth < minWidth ? minWidth : newWidth;
      updateTrackerPosition(right + updatedWidth - width);
      if (newWidth >= minWidth) {
        setHeaderCellWidth(newWidth);
      }
      // callbacks must be the last calls in the handler, because they may cause an extra update
      onWidthUpdate(newWidth);
    };

    const resizeColumn = (offset: number) => {
      if (offset > leftEdge) {
        const cellLeft = elements.header.getBoundingClientRect().left;
        const newWidth = offset - cellLeft;
        // callbacks must be the last calls in the handler, because they may cause an extra update
        updateColumnWidth(newWidth);
      }
    };

    const onAutoGrow = () => {
      const width = elements.header.getBoundingClientRect().width;
      autoGrowTimeout.current = setTimeout(onAutoGrow, AUTO_GROW_INTERVAL);
      // callbacks must be the last calls in the handler, because they may cause an extra update
      updateColumnWidth(width + AUTO_GROW_INCREMENT);
      elements.scrollParent.scrollLeft += AUTO_GROW_INCREMENT;
    };

    const onMouseMove = (event: MouseEvent) => {
      clearTimeout(autoGrowTimeout.current);
      const offset = event.pageX;
      if (offset > rightEdge) {
        autoGrowTimeout.current = setTimeout(onAutoGrow, AUTO_GROW_START_TIME);
      } else {
        resizeColumn(offset);
      }
    };

    const onMouseUp = (event: MouseEvent) => {
      resizeColumn(event.pageX);
      setIsDragging(false);
      onWidthUpdateCommit();
      clearTimeout(autoGrowTimeout.current);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === KeyCode.left) {
        event.preventDefault();
        updateColumnWidth(elements.header.getBoundingClientRect().width - 10);
        setTimeout(() => onWidthUpdateCommit(), 0);
      }
      if (event.keyCode === KeyCode.right) {
        event.preventDefault();
        updateColumnWidth(elements.header.getBoundingClientRect().width + 10);
        setTimeout(() => onWidthUpdateCommit(), 0);
      }
    };

    updateTrackerPosition(elements.header.getBoundingClientRect().right);

    if (isDragging) {
      document.body.classList.add(styles['resize-active']);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
    if (resizerHasFocus) {
      document.body.classList.add(styles['resize-active']);
      document.body.classList.add(styles['resize-active-with-focus']);
      elements.header.addEventListener('keydown', onKeyDown);
    }

    return () => {
      clearTimeout(autoGrowTimeout.current);
      document.body.classList.remove(styles['resize-active']);
      document.body.classList.remove(styles['resize-active-with-focus']);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      elements.header.removeEventListener('keydown', onKeyDown);
    };
  }, [isDragging, resizerHasFocus, minWidth, onWidthUpdate, onWidthUpdateCommit]);

  const headerCellWidthString = headerCellWidth.toFixed(0);
  const resizerAriaProps = {
    role: 'separator',
    'aria-labelledby': ariaLabelledby,
    'aria-orientation': 'vertical' as const,
    'aria-valuenow': headerCellWidth,
    // aria-valuetext is needed because the VO announces "collapsed" when only aria-valuenow set without aria-valuemax
    'aria-valuetext': headerCellWidthString,
    'aria-valuemin': minWidth,
  };

  return (
    <>
      <span
        ref={resizerRef}
        className={clsx(
          styles.resizer,
          isDragging && styles['resizer-active'],
          (resizerHasFocus || showFocusRing) && styles['has-focus']
        )}
        onMouseDown={event => {
          if (event.button !== 0) {
            return;
          }
          event.preventDefault();
          setIsDragging(true);
        }}
        onClick={() => {
          // Prevents dragging mode activation for VO+Space click.
          setIsDragging(false);
        }}
        onFocus={() => {
          setHeaderCellWidth(getHeaderWidth(resizerRef.current));
          setResizerHasFocus(true);
        }}
        onBlur={() => {
          setResizerHasFocus(false);
        }}
        {...resizerAriaProps}
        tabIndex={tabIndex}
        data-focus-id={focusId}
      />
    </>
  );
}

export function ResizeTracker() {
  return <span className={styles.tracker} />;
}
