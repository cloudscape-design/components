// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useStableCallback, useUniqueId } from '@cloudscape-design/component-toolkit/internal';
import { getIsRtl, getLogicalBoundingClientRect, getLogicalPageX } from '@cloudscape-design/component-toolkit/internal';

import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context.js';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import { KeyCode } from '../../internal/keycode';
import handleKey, { isEventLike } from '../../internal/utils/handle-key';
import { DEFAULT_COLUMN_WIDTH } from '../use-column-widths';
import { getHeaderWidth, getResizerElements } from './resizer-lookup';

import styles from './styles.css.js';

interface ResizerProps {
  onWidthUpdate: (newWidth: number) => void;
  onWidthUpdateCommit: () => void;
  ariaLabelledby?: string;
  minWidth?: number;
  tabIndex?: number;
  focusId?: string;
  showFocusRing?: boolean;
  roleDescription?: string;
}

const AUTO_GROW_START_TIME = 10;
const AUTO_GROW_INTERVAL = 10;
const AUTO_GROW_INCREMENT = 5;

export function Divider({ className }: { className?: string }) {
  return <span className={clsx(styles.divider, styles['divider-disabled'], className)} />;
}

export function Resizer({
  onWidthUpdate,
  onWidthUpdateCommit,
  ariaLabelledby,
  minWidth = DEFAULT_COLUMN_WIDTH,
  tabIndex,
  showFocusRing,
  focusId,
  roleDescription,
}: ResizerProps) {
  onWidthUpdate = useStableCallback(onWidthUpdate);
  onWidthUpdateCommit = useStableCallback(onWidthUpdateCommit);

  const isVisualRefresh = useVisualRefresh();

  const separatorId = useUniqueId();
  const resizerToggleRef = useRef<HTMLButtonElement>(null);
  const resizerSeparatorRef = useRef<HTMLSpanElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isKeyboardDragging, setIsKeyboardDragging] = useState(false);
  const autoGrowTimeout = useRef<ReturnType<typeof setTimeout> | undefined>();
  const [resizerHasFocus, setResizerHasFocus] = useState(false);
  const [headerCellWidth, setHeaderCellWidth] = useState(0);

  // Read header width after mounting for it to be available in the element's ARIA label before it gets focused.
  useEffect(() => {
    setHeaderCellWidth(getHeaderWidth(resizerToggleRef.current));
  }, []);

  useEffect(() => {
    const elements = getResizerElements(resizerToggleRef.current);
    const document = resizerToggleRef.current?.ownerDocument ?? window.document;

    if ((!isDragging && !resizerHasFocus) || !elements) {
      return;
    }

    const { insetInlineStart: inlineStartEdge, insetInlineEnd: inlineEndEdge } = getLogicalBoundingClientRect(
      elements.scrollParent
    );

    const updateTrackerPosition = (newOffset: number) => {
      const { insetInlineStart: scrollParentInsetInlineStart } = getLogicalBoundingClientRect(elements.table);
      elements.tracker.style.insetBlockStart = getLogicalBoundingClientRect(elements.header).blockSize + 'px';
      // minus one pixel to offset the cell border
      elements.tracker.style.insetInlineStart = newOffset - scrollParentInsetInlineStart - 1 + 'px';
    };

    const updateColumnWidth = (newWidth: number) => {
      const { insetInlineEnd, inlineSize } = getLogicalBoundingClientRect(elements.header);
      const updatedWidth = newWidth < minWidth ? minWidth : newWidth;
      updateTrackerPosition(insetInlineEnd + updatedWidth - inlineSize);
      if (newWidth >= minWidth) {
        setHeaderCellWidth(newWidth);
      }
      // callbacks must be the last calls in the handler, because they may cause an extra update
      onWidthUpdate(newWidth);
    };

    const resizeColumn = (offset: number) => {
      if (offset > inlineStartEdge) {
        const cellLeft = getLogicalBoundingClientRect(elements.header).insetInlineStart;
        const newWidth = offset - cellLeft;
        // callbacks must be the last calls in the handler, because they may cause an extra update
        updateColumnWidth(newWidth);
      }
    };

    const onAutoGrow = () => {
      const inlineSize = getLogicalBoundingClientRect(elements.header).inlineSize;
      autoGrowTimeout.current = setTimeout(onAutoGrow, AUTO_GROW_INTERVAL);
      // callbacks must be the last calls in the handler, because they may cause an extra update
      updateColumnWidth(inlineSize + AUTO_GROW_INCREMENT);
      elements.scrollParent.scrollLeft += AUTO_GROW_INCREMENT * (getIsRtl(elements.scrollParent) ? -1 : 1);
    };

    const onMouseMove = (event: MouseEvent) => {
      clearTimeout(autoGrowTimeout.current);
      const offset = getLogicalPageX(event);
      if (offset > inlineEndEdge) {
        autoGrowTimeout.current = setTimeout(onAutoGrow, AUTO_GROW_START_TIME);
      } else {
        resizeColumn(offset);
      }
    };

    const onMouseUp = (event: MouseEvent) => {
      resizeColumn(getLogicalPageX(event));
      setIsDragging(false);
      onWidthUpdateCommit();
      clearTimeout(autoGrowTimeout.current);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isKeyboardDragging) {
        const keys = [KeyCode.left, KeyCode.right, KeyCode.enter, KeyCode.right, KeyCode.space, KeyCode.escape];

        if (keys.indexOf(event.keyCode) !== -1) {
          event.preventDefault();

          if (isEventLike(event)) {
            handleKey(event, {
              onActivate: () => {
                setIsKeyboardDragging(false);
                resizerToggleRef.current?.focus();
              },
              onEscape: () => {
                setIsKeyboardDragging(false);
                resizerToggleRef.current?.focus();
              },
              onInlineStart: () => updateColumnWidth(getLogicalBoundingClientRect(elements.header).inlineSize - 10),
              onInlineEnd: () => updateColumnWidth(getLogicalBoundingClientRect(elements.header).inlineSize + 10),
            });
          }
        }
      }
      // Enter keyboard dragging mode
      else if (event.keyCode === KeyCode.enter || event.keyCode === KeyCode.space) {
        event.preventDefault();

        if (isEventLike(event)) {
          handleKey(event, {
            onActivate: () => {
              setIsKeyboardDragging(true);
              resizerSeparatorRef.current?.focus();
            },
          });
        }
      }
    };

    updateTrackerPosition(getLogicalBoundingClientRect(elements.header).insetInlineEnd);
    const controller = new AbortController();

    if (isDragging) {
      document.body.classList.add(styles['resize-active']);
      document.addEventListener('mousemove', onMouseMove, { signal: controller.signal });
      document.addEventListener('mouseup', onMouseUp, { signal: controller.signal });
    }
    if (resizerHasFocus) {
      document.body.classList.add(styles['resize-active-with-focus']);
      elements.header.addEventListener('keydown', onKeyDown, { signal: controller.signal });
    }
    if (isKeyboardDragging) {
      document.body.classList.add(styles['resize-active']);
    }

    return () => {
      clearTimeout(autoGrowTimeout.current);
      document.body.classList.remove(styles['resize-active']);
      document.body.classList.remove(styles['resize-active-with-focus']);
      controller.abort();
    };
  }, [minWidth, isDragging, isKeyboardDragging, resizerHasFocus, onWidthUpdate, onWidthUpdateCommit]);

  const { tabIndex: resizerTabIndex } = useSingleTabStopNavigation(resizerToggleRef, { tabIndex });

  return (
    <>
      <button
        ref={resizerToggleRef}
        className={clsx(
          styles.resizer,
          (resizerHasFocus || showFocusRing || isKeyboardDragging) && styles['has-focus'],
          isVisualRefresh && styles['is-visual-refresh']
        )}
        onMouseDown={event => {
          if (event.button !== 0) {
            return;
          }
          event.preventDefault();
          setIsDragging(true);
        }}
        onClick={() => {
          // Prevent mouse drag activation and activate keyboard dragging for VO+Space click.
          setIsDragging(false);
          setResizerHasFocus(true);
          setIsKeyboardDragging(true);
          resizerSeparatorRef.current?.focus();
        }}
        onFocus={() => {
          setHeaderCellWidth(getHeaderWidth(resizerToggleRef.current));
          setResizerHasFocus(true);
        }}
        onBlur={event => {
          // Ignoring blur event when focus moves to the resizer separator element.
          // (This focus transition is done programmatically when the resizer button is clicked).
          if (event.relatedTarget !== resizerSeparatorRef.current) {
            setResizerHasFocus(false);
          }
        }}
        // Using a custom role-description to make the element's purpose better clear.
        // The role-description must include the word "button" to imply the interaction model.
        // See https://www.w3.org/TR/wai-aria-1.1/#aria-roledescription
        aria-roledescription={roleDescription}
        aria-labelledby={ariaLabelledby}
        tabIndex={resizerTabIndex}
        data-focus-id={focusId}
      />
      <span
        className={clsx(
          styles['divider-interactive'],
          isDragging && styles['divider-active'],
          isVisualRefresh && styles['is-visual-refresh']
        )}
        data-awsui-table-suppress-navigation={true}
        ref={resizerSeparatorRef}
        id={separatorId}
        role="slider"
        tabIndex={-1}
        aria-labelledby={ariaLabelledby}
        aria-hidden={!isKeyboardDragging}
        aria-valuemin={minWidth}
        // aria-valuemax is needed because the slider is inoperable in VoiceOver without it
        aria-valuemax={Number.MAX_SAFE_INTEGER}
        aria-valuenow={headerCellWidth}
        data-focus-id={focusId}
        onBlur={() => {
          setResizerHasFocus(false);
          if (isKeyboardDragging) {
            setIsKeyboardDragging(false);
          }
          onWidthUpdateCommit();
        }}
      />
    </>
  );
}

export function ResizeTracker() {
  return <span className={styles.tracker} />;
}
