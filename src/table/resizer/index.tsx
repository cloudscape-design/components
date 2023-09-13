// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getOverflowParents } from '../../internal/utils/scrollable-containers';
import { findUpUntil } from '../../internal/utils/dom';
import tableStyles from '../styles.css.js';
import styles from './styles.css.js';
import { KeyCode } from '../../internal/keycode';
import { DEFAULT_COLUMN_WIDTH } from '../use-column-widths';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

interface ResizerProps {
  onDragMove: (newWidth: number) => void;
  onFinish: () => void;
  ariaLabelledby?: string;
  minWidth?: number;
  tabIndex?: number;
  focusId?: string;
  showFocusRing?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const AUTO_GROW_START_TIME = 10;
const AUTO_GROW_INTERVAL = 10;
const AUTO_GROW_INCREMENT = 5;

export function Resizer({
  onDragMove,
  onFinish,
  ariaLabelledby,
  minWidth = DEFAULT_COLUMN_WIDTH,
  tabIndex,
  showFocusRing,
  focusId,
  onFocus,
  onBlur,
}: ResizerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [headerCell, setHeaderCell] = useState<null | HTMLElement>(null);
  const autoGrowTimeout = useRef<ReturnType<typeof setTimeout> | undefined>();
  const onFinishStable = useStableCallback(onFinish);
  const onDragStable = useStableCallback(onDragMove);
  const [resizerHasFocus, setResizerHasFocus] = useState(false);
  const [headerCellWidth, setHeaderCellWidth] = useState(0);
  const originalHeaderCellWidthRef = useRef(0);

  const handlers = useMemo(() => {
    if (!headerCell) {
      return null;
    }

    const rootElement = findUpUntil(headerCell, element => element.className.indexOf(tableStyles.root) > -1)!;
    const tableElement = rootElement.querySelector<HTMLElement>(`table`)!;
    // tracker is rendered inside table wrapper to align with its size
    const trackerElement = rootElement.querySelector<HTMLElement>(`.${styles.tracker}`)!;
    const scrollParent = getOverflowParents(headerCell)[0];
    const { left: leftEdge, right: rightEdge } = scrollParent.getBoundingClientRect();

    const updateTrackerPosition = (newOffset: number) => {
      const { left: scrollParentLeft } = tableElement.getBoundingClientRect();
      trackerElement.style.top = headerCell.getBoundingClientRect().height + 'px';
      // minus one pixel to offset the cell border
      trackerElement.style.left = newOffset - scrollParentLeft - 1 + 'px';
    };

    const updateColumnWidth = (newWidth: number) => {
      const { right, width } = headerCell.getBoundingClientRect();
      const updatedWidth = newWidth < minWidth ? minWidth : newWidth;
      updateTrackerPosition(right + updatedWidth - width);
      setHeaderCellWidth(newWidth);
      // callbacks must be the last calls in the handler, because they may cause an extra update
      onDragStable(newWidth);
    };

    const resetColumnWidth = () => {
      updateColumnWidth(originalHeaderCellWidthRef.current);
    };

    const resizeColumn = (offset: number) => {
      if (offset > leftEdge) {
        const cellLeft = headerCell.getBoundingClientRect().left;
        const newWidth = offset - cellLeft;
        // callbacks must be the last calls in the handler, because they may cause an extra update
        updateColumnWidth(newWidth);
      }
    };

    const onAutoGrow = () => {
      const width = headerCell.getBoundingClientRect().width;
      autoGrowTimeout.current = setTimeout(onAutoGrow, AUTO_GROW_INTERVAL);
      // callbacks must be the last calls in the handler, because they may cause an extra update
      updateColumnWidth(width + AUTO_GROW_INCREMENT);
      scrollParent.scrollLeft += AUTO_GROW_INCREMENT;
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
      onFinishStable();
      clearTimeout(autoGrowTimeout.current);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === KeyCode.left) {
        event.preventDefault();
        updateColumnWidth(headerCell.getBoundingClientRect().width - 10);
        setTimeout(() => onFinishStable(), 0);
      }
      if (event.keyCode === KeyCode.right) {
        event.preventDefault();
        updateColumnWidth(headerCell.getBoundingClientRect().width + 10);
        setTimeout(() => onFinishStable(), 0);
      }
    };

    return { updateTrackerPosition, updateColumnWidth, resetColumnWidth, onMouseMove, onMouseUp, onKeyDown };
  }, [headerCell, minWidth, onDragStable, onFinishStable]);

  useEffect(() => {
    if ((!isDragging && !resizerHasFocus) || !headerCell || !handlers) {
      return;
    }

    originalHeaderCellWidthRef.current = headerCell.getBoundingClientRect().width;

    handlers.updateTrackerPosition(headerCell.getBoundingClientRect().right);

    if (isDragging) {
      document.body.classList.add(styles['resize-active']);
      document.addEventListener('mousemove', handlers.onMouseMove);
      document.addEventListener('mouseup', handlers.onMouseUp);
    }
    if (resizerHasFocus) {
      document.body.classList.add(styles['resize-active']);
      document.body.classList.add(styles['resize-active-with-focus']);
      headerCell.addEventListener('keydown', handlers.onKeyDown);
    }

    return () => {
      clearTimeout(autoGrowTimeout.current);
      document.body.classList.remove(styles['resize-active']);
      document.body.classList.remove(styles['resize-active-with-focus']);
      document.removeEventListener('mousemove', handlers.onMouseMove);
      document.removeEventListener('mouseup', handlers.onMouseUp);
      headerCell.removeEventListener('keydown', handlers.onKeyDown);
    };
  }, [headerCell, isDragging, onFinishStable, resizerHasFocus, handlers]);

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

  // Read header width after mounting for it to be available in the element's ARIA label before it gets focused.
  const resizerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (resizerRef.current) {
      const headerCell = findUpUntil(resizerRef.current, element => element.tagName.toLowerCase() === 'th')!;
      setHeaderCellWidth(headerCell.getBoundingClientRect().width);
    }
  }, []);

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
          const headerCell = findUpUntil(event.currentTarget, element => element.tagName.toLowerCase() === 'th')!;
          setIsDragging(true);
          setHeaderCell(headerCell);
        }}
        onFocus={event => {
          const headerCell = findUpUntil(event.currentTarget, element => element.tagName.toLowerCase() === 'th')!;
          setHeaderCellWidth(headerCell.getBoundingClientRect().width);
          setResizerHasFocus(true);
          setHeaderCell(headerCell);
          onFocus?.();
        }}
        onBlur={() => {
          setResizerHasFocus(false);
          onBlur?.();
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
