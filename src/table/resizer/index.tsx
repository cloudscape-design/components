// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useStableCallback, useUniqueId } from '@cloudscape-design/component-toolkit/internal';
import { getIsRtl, getLogicalBoundingClientRect, getLogicalPageX } from '@cloudscape-design/component-toolkit/internal';
import { useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';

import DragHandleWrapper from '../../internal/components/drag-handle-wrapper';
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
  tooltipText?: string;
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
  tooltipText,
}: ResizerProps) {
  onWidthUpdate = useStableCallback(onWidthUpdate);
  onWidthUpdateCommit = useStableCallback(onWidthUpdateCommit);

  const isVisualRefresh = useVisualRefresh();

  const separatorId = useUniqueId();
  const resizerToggleRef = useRef<HTMLButtonElement>(null);
  const resizerSeparatorRef = useRef<HTMLSpanElement>(null);

  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUapButtons, setShowUapButtons] = useState(false);
  const [isKeyboardDragging, setIsKeyboardDragging] = useState(false);
  const autoGrowTimeout = useRef<ReturnType<typeof setTimeout> | undefined>();
  const [resizerHasFocus, setResizerHasFocus] = useState(false);
  const [headerCellWidth, setHeaderCellWidth] = useState(0);

  // Read header width after mounting for it to be available in the element's ARIA label before it gets focused.
  useEffect(() => {
    setHeaderCellWidth(getHeaderWidth(resizerToggleRef.current));
  }, []);

  const updateTrackerPosition = useCallback((newOffset: number) => {
    const elements = getResizerElements(resizerToggleRef.current);
    if (!elements) {
      return;
    }

    const { insetInlineStart: scrollParentInsetInlineStart } = getLogicalBoundingClientRect(elements.table);
    elements.tracker.style.insetBlockStart = getLogicalBoundingClientRect(elements.header).blockSize + 'px';
    // minus one pixel to offset the cell border
    elements.tracker.style.insetInlineStart = newOffset - scrollParentInsetInlineStart - 1 + 'px';
  }, []);

  const updateColumnWidth = useCallback(
    (newWidth: number) => {
      const elements = getResizerElements(resizerToggleRef.current);
      if (!elements) {
        return;
      }

      const { insetInlineEnd, inlineSize } = getLogicalBoundingClientRect(elements.header);
      const updatedWidth = newWidth < minWidth ? minWidth : newWidth;
      updateTrackerPosition(insetInlineEnd + updatedWidth - inlineSize);
      setHeaderCellWidth(updatedWidth);

      // callbacks must be the last calls in the handler, because they may cause an extra update
      onWidthUpdate(newWidth);
    },
    [minWidth, onWidthUpdate, updateTrackerPosition]
  );

  const resizeColumn = useCallback(
    (offset: number) => {
      const elements = getResizerElements(resizerToggleRef.current);
      if (!elements) {
        return;
      }

      const { insetInlineStart: inlineStartEdge } = getLogicalBoundingClientRect(elements.scrollParent);
      if (offset > inlineStartEdge) {
        const cellLeft = getLogicalBoundingClientRect(elements.header).insetInlineStart;
        const newWidth = offset - cellLeft;
        // callbacks must be the last calls in the handler, because they may cause an extra update
        updateColumnWidth(newWidth);
      }
    },
    [updateColumnWidth]
  );

  useEffect(() => {
    const elements = getResizerElements(resizerToggleRef.current);
    const document = resizerToggleRef.current?.ownerDocument ?? window.document;

    if ((!isPointerDown && !resizerHasFocus) || !elements) {
      return;
    }

    const { insetInlineEnd: inlineEndEdge } = getLogicalBoundingClientRect(elements.scrollParent);

    const onAutoGrow = () => {
      const inlineSize = getLogicalBoundingClientRect(elements.header).inlineSize;
      autoGrowTimeout.current = setTimeout(onAutoGrow, AUTO_GROW_INTERVAL);
      // callbacks must be the last calls in the handler, because they may cause an extra update
      updateColumnWidth(inlineSize + AUTO_GROW_INCREMENT);
      elements.scrollParent.scrollLeft += AUTO_GROW_INCREMENT * (getIsRtl(elements.scrollParent) ? -1 : 1);
    };

    const onPointerMove = (event: PointerEvent) => {
      // TODO: Only set it to true after a certain number of pixels travelled?
      setIsDragging(true);
      clearTimeout(autoGrowTimeout.current);
      const offset = getLogicalPageX(event);
      if (offset > inlineEndEdge) {
        autoGrowTimeout.current = setTimeout(onAutoGrow, AUTO_GROW_START_TIME);
      } else {
        resizeColumn(offset);
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      setIsPointerDown(false);
      if (isDragging) {
        setIsDragging(false);
        resizeColumn(getLogicalPageX(event));
      } else {
        setShowUapButtons(true);
      }
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
                setShowUapButtons(false);
                resizerToggleRef.current?.focus();
              },
              onEscape: () => {
                setIsKeyboardDragging(false);
                setShowUapButtons(false);
                resizerToggleRef.current?.focus();
              },
              onInlineStart: () => {
                updateColumnWidth(getLogicalBoundingClientRect(elements.header).inlineSize - 10);
              },
              onInlineEnd: () => {
                updateColumnWidth(getLogicalBoundingClientRect(elements.header).inlineSize + 10);
              },
            });
          }
        }
      } else {
        if (event.keyCode === KeyCode.enter || event.keyCode === KeyCode.space) {
          // Enter keyboard dragging mode
          event.preventDefault();

          if (isEventLike(event)) {
            handleKey(event, {
              onActivate: () => {
                setShowUapButtons(true);
                setIsKeyboardDragging(true);
                resizerSeparatorRef.current?.focus();
              },
            });
          }
        } else {
          // Showing the UAP buttons when the button is only focused and not activated
          // gives a false impression that you can resize with the arrow keys.
          setShowUapButtons(false);
        }
      }
    };

    updateTrackerPosition(getLogicalBoundingClientRect(elements.header).insetInlineEnd);
    const controller = new AbortController();

    if (isPointerDown) {
      document.body.classList.add(styles['resize-active']);
      document.addEventListener('pointermove', onPointerMove, { signal: controller.signal });
      document.addEventListener('pointerup', onPointerUp, { signal: controller.signal });
    } else if (resizerHasFocus) {
      document.body.classList.add(styles['resize-active-with-focus']);
      elements.header.addEventListener('keydown', onKeyDown, { signal: controller.signal });
    }
    if (isKeyboardDragging) {
      document.body.classList.add(styles['resize-active']);
    }

    return () => {
      document.body.classList.remove(styles['resize-active']);
      document.body.classList.remove(styles['resize-active-with-focus']);
      controller.abort();
    };
  }, [
    isDragging,
    isKeyboardDragging,
    isPointerDown,
    resizerHasFocus,
    onWidthUpdateCommit,
    resizeColumn,
    updateColumnWidth,
    updateTrackerPosition,
  ]);

  useEffect(() => {
    if (isDragging) {
      return () => clearTimeout(autoGrowTimeout.current);
    }
  }, [isDragging]);

  const { tabIndex: resizerTabIndex } = useSingleTabStopNavigation(resizerToggleRef, { tabIndex });

  return (
    <div className={styles['resizer-wrapper']}>
      <DragHandleWrapper
        clickDragThreshold={3}
        hideButtonsOnDrag={false}
        directions={{
          'inline-start': headerCellWidth > minWidth ? 'active' : 'disabled',
          'inline-end': 'active',
        }}
        triggerMode="controlled"
        controlledShowButtons={showUapButtons}
        wrapperClassName={styles['resizer-button-wrapper']}
        tooltipText={tooltipText}
        onDirectionClick={direction => {
          const elements = getResizerElements(resizerToggleRef.current);
          if (!elements) {
            return;
          }

          if (direction === 'inline-start') {
            updateColumnWidth(getLogicalBoundingClientRect(elements.header).inlineSize - 20);
            requestAnimationFrame(onWidthUpdateCommit);
          } else if (direction === 'inline-end') {
            updateColumnWidth(getLogicalBoundingClientRect(elements.header).inlineSize + 20);
            requestAnimationFrame(onWidthUpdateCommit);
          }
        }}
      >
        <button
          ref={resizerToggleRef}
          className={clsx(
            styles.resizer,
            (resizerHasFocus || showFocusRing || isKeyboardDragging) && styles['has-focus'],
            isVisualRefresh && styles['is-visual-refresh']
          )}
          onPointerDown={event => {
            if (event.pointerType === 'mouse' && event.button !== 0) {
              return;
            }
            setIsPointerDown(true);
          }}
          onClick={() => {
            // Prevent mouse drag activation and activate keyboard dragging for VO+Space click.
            setIsPointerDown(false);
            setIsDragging(false);
            setShowUapButtons(true);
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
              setShowUapButtons(false);
              return;
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
            (isPointerDown || isDragging) && styles['divider-active'],
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
          onBlur={event => {
            setIsKeyboardDragging(false);
            if (event.relatedTarget !== resizerToggleRef.current) {
              setResizerHasFocus(false);
              setShowUapButtons(false);
            }
            onWidthUpdateCommit();
          }}
        />
      </DragHandleWrapper>
    </div>
  );
}

export function ResizeTracker() {
  return <span className={styles.tracker} />;
}
