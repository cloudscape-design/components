// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.css.js';
import { KeyCode } from '../../internal/keycode';
import { DEFAULT_COLUMN_WIDTH } from '../use-column-widths';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { ResizerDomHelper } from './dom-helper.js';

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

  const resizerDom = useRef<ResizerDomHelper>(new ResizerDomHelper(null));
  const autoGrowTimeout = useRef<ReturnType<typeof setTimeout> | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  const [resizerHasFocus, setResizerHasFocus] = useState(false);
  const [headerCellWidth, setHeaderCellWidth] = useState(0);

  // Read header width after mounting for it to be available in the element's ARIA label before it gets focused.
  useEffect(() => setHeaderCellWidth(resizerDom.current.header.getBoundingClientRect().width), []);

  const handlers = useMemo(() => {
    const updateTrackerPosition = (newOffset: number) => {
      const { left: scrollParentLeft } = resizerDom.current.table.getBoundingClientRect();
      resizerDom.current.tracker.style.top = resizerDom.current.header.getBoundingClientRect().height + 'px';
      // minus one pixel to offset the cell border
      resizerDom.current.tracker.style.left = newOffset - scrollParentLeft - 1 + 'px';
    };

    const updateColumnWidth = (newWidth: number) => {
      const right = resizerDom.current.header.getBoundingClientRect().right;
      const width = resizerDom.current.header.getBoundingClientRect().width;
      const updatedWidth = newWidth < minWidth ? minWidth : newWidth;
      updateTrackerPosition(right + updatedWidth - width);
      if (newWidth >= minWidth) {
        setHeaderCellWidth(newWidth);
      }
      // callbacks must be the last calls in the handler, because they may cause an extra update
      onWidthUpdate(newWidth);
    };

    const resizeColumn = (offset: number) => {
      if (offset > resizerDom.current.scrollParent.getBoundingClientRect().left) {
        const newWidth = offset - resizerDom.current.header.getBoundingClientRect().left;
        // callbacks must be the last calls in the handler, because they may cause an extra update
        updateColumnWidth(newWidth);
      }
    };

    const onAutoGrow = () => {
      autoGrowTimeout.current = setTimeout(onAutoGrow, AUTO_GROW_INTERVAL);
      // callbacks must be the last calls in the handler, because they may cause an extra update
      updateColumnWidth(resizerDom.current.header.getBoundingClientRect().width + AUTO_GROW_INCREMENT);
      resizerDom.current.scrollParent.scrollLeft += AUTO_GROW_INCREMENT;
    };

    const onMouseMove = (event: MouseEvent) => {
      clearTimeout(autoGrowTimeout.current);
      const offset = event.pageX;
      if (offset > resizerDom.current.scrollParent.getBoundingClientRect().right) {
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
        updateColumnWidth(resizerDom.current.header.getBoundingClientRect().width - 10);
        setTimeout(() => onWidthUpdateCommit(), 0);
      }
      if (event.keyCode === KeyCode.right) {
        event.preventDefault();
        updateColumnWidth(resizerDom.current.header.getBoundingClientRect().width + 10);
        setTimeout(() => onWidthUpdateCommit(), 0);
      }
    };

    return { updateTrackerPosition, updateColumnWidth, onMouseMove, onMouseUp, onKeyDown };
  }, [minWidth, onWidthUpdate, onWidthUpdateCommit]);

  useEffect(() => {
    if ((!isDragging && !resizerHasFocus) || !handlers) {
      return;
    }

    handlers.updateTrackerPosition(resizerDom.current.header.getBoundingClientRect().right);

    if (isDragging) {
      document.body.classList.add(styles['resize-active']);
      document.addEventListener('mousemove', handlers.onMouseMove);
      document.addEventListener('mouseup', handlers.onMouseUp);
    }
    if (resizerHasFocus) {
      document.body.classList.add(styles['resize-active']);
      document.body.classList.add(styles['resize-active-with-focus']);
      resizerDom.current.header.addEventListener('keydown', handlers.onKeyDown);
    }

    return () => {
      clearTimeout(autoGrowTimeout.current);
      document.body.classList.remove(styles['resize-active']);
      document.body.classList.remove(styles['resize-active-with-focus']);
      document.removeEventListener('mousemove', handlers.onMouseMove);
      document.removeEventListener('mouseup', handlers.onMouseUp);
      resizerDom.current.header.removeEventListener('keydown', handlers.onKeyDown);
    };
  }, [isDragging, onWidthUpdateCommit, resizerHasFocus, handlers]);

  const headerCellWidthString = headerCellWidth.toFixed(0);
  const resizerAriaProps = {
    role: 'separator',
    'aria-labelledby': ariaLabelledby,
    'aria-orientation': 'vertical' as const,
    'aria-valuenow': Math.round(headerCellWidth),
    // aria-valuetext is needed because the VO announces "collapsed" when only aria-valuenow set without aria-valuemax
    'aria-valuetext': headerCellWidthString,
    'aria-valuemin': minWidth,
  };

  return (
    <>
      <span
        ref={node => (resizerDom.current = new ResizerDomHelper(node))}
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
          setHeaderCellWidth(resizerDom.current.header.getBoundingClientRect().width);
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
