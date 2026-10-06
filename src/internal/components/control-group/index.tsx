// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useCallback, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { BaseComponentProps } from '../../../types/base-component';
import { getBaseProps } from '../../base-component';
import {
  GroupedControlContext,
  GroupedControlDirection,
  GroupedControlPosition,
} from '../../context/control-group-context';
import { flattenChildren } from '../../utils/flatten-children';

import styles from './styles.css.js';

// `'auto'` exists only at the prop boundary; it resolves to a concrete axis before reaching
// context, classes, or SCSS.
type ControlGroupDirection = GroupedControlDirection | 'auto';

export interface InternalControlGroupProps extends BaseComponentProps {
  children?: React.ReactNode;
  /**
   * The axis along which the controls are laid out.
   * - `'auto'` (default): measures the available width and lays the controls out as a single
   *   row when they fit, stacking them vertically when they do not.
   * - `'horizontal'` / `'vertical'`: forces that axis and skips measurement.
   */
  direction?: ControlGroupDirection;
}

const InternalControlGroup = forwardRef<HTMLDivElement, InternalControlGroupProps>(
  ({ children, direction = 'auto', ...props }, ref) => {
    const baseProps = getBaseProps(props);

    const flattenedChildren = flattenChildren(children, 'ControlGroup');
    const controlCount = flattenedChildren.length;

    // Compare two independent widths so the group's own collapse can't feed back and leave it
    // stuck stacked: `availableWidth` (the line the group sits on) vs `requiredRowWidth` (what
    // the controls need as one row, measured from the never-shrinking ghost below).
    const [availableWidth, setAvailableWidth] = useState<number | null>(null);
    const [requiredRowWidth, ghostWidthRef] = useContainerQuery<number>(entry => entry.contentBoxWidth);

    // Walk up past shrink-wrapping ancestors to the first one that actually constrains the
    // group. Its width doesn't follow the group's collapse, so the group can re-expand.
    const rootElRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<ResizeObserver | null>(null);

    const measureAvailableWidth = useCallback(() => {
      const root = rootElRef.current;
      if (!root) {
        return;
      }
      const rootWidth = root.getBoundingClientRect().width;
      let container: HTMLElement | null = root.parentElement;
      let available: number | null = null;
      for (let i = 0; container && i < 20; i++) {
        const style = getComputedStyle(container);
        // Content-box width: clientWidth minus inline padding.
        const paddingInline = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const contentWidth = container.clientWidth - paddingInline;
        available = contentWidth;
        // Wider than the group: this ancestor defines the available width.
        if (contentWidth > rootWidth + 1) {
          break;
        }
        // Same width but clips/scrolls (or the group overflows it): it constrains the group.
        const clipsOrScrolls =
          style.overflowX !== 'visible' ||
          style.overflow !== 'visible' ||
          container.scrollWidth > container.clientWidth;
        if (clipsOrScrolls) {
          break;
        }
        // Otherwise it just shrink-wraps to the group: keep looking.
        container = container.parentElement;
      }
      setAvailableWidth(available);
    }, []);

    const measureRootRef = useCallback(
      (node: HTMLDivElement | null) => {
        observerRef.current?.disconnect();
        observerRef.current = null;
        rootElRef.current = node;
        if (!node || typeof ResizeObserver === 'undefined') {
          return;
        }
        // Re-run the walk whenever the root or any ancestor resizes.
        const observer = new ResizeObserver(() => measureAvailableWidth());
        observer.observe(node);
        for (let el: HTMLElement | null = node.parentElement, i = 0; el && i < 20; i++, el = el.parentElement) {
          observer.observe(el);
        }
        observerRef.current = observer;
        measureAvailableWidth();
      },
      [measureAvailableWidth]
    );
    const rootRef = useMergeRefs(ref, measureRootRef);

    useLayoutEffect(() => () => observerRef.current?.disconnect(), []);

    // Mark the ghost subtree `inert` so its duplicated controls add no tab stops and are
    // hidden from assistive tech. Set via ref because `inert` isn't rendered by React < 19.
    const ghostElRef = useRef<HTMLDivElement | null>(null);
    useLayoutEffect(() => {
      if (ghostElRef.current) {
        ghostElRef.current.inert = true;
      }
    });
    const ghostRef = useMergeRefs(ghostWidthRef, ghostElRef);

    // Stack when the row doesn't fit. The `-1` tolerance avoids flipping on sub-pixel
    // rounding; stay a row until both widths are measured.
    const stacked =
      availableWidth !== null && requiredRowWidth !== null ? availableWidth < requiredRowWidth - 1 : false;

    // A forced direction wins; `'auto'` uses the measurement.
    const resolvedDirection: GroupedControlDirection =
      direction === 'auto' ? (stacked ? 'vertical' : 'horizontal') : direction;

    const renderControlSlots = () =>
      flattenedChildren.map((child, index) => {
        const key = child && typeof child === 'object' ? (child as Record<'key', unknown>).key : undefined;
        const position: GroupedControlPosition =
          controlCount === 1 ? 'only' : index === 0 ? 'first' : index === controlCount - 1 ? 'last' : 'middle';
        return (
          <div
            key={key ? String(key) : index}
            className={clsx(styles.control, styles[`control-${position}-${resolvedDirection}`])}
          >
            <GroupedControlContext.Provider value={{ position, direction: resolvedDirection }}>
              {child}
            </GroupedControlContext.Provider>
          </div>
        );
      });

    return (
      <div
        {...baseProps}
        ref={rootRef}
        role="group"
        className={clsx(baseProps.className, styles.root, styles[`root-${resolvedDirection}`])}
      >
        {renderControlSlots()}

        {/*
        Hidden row that duplicates the controls to measure their single-row width, out of
        flow so its width is stable when the visible group stacks. Only needed in `auto` mode.
      */}
        {direction === 'auto' && (
          <div ref={ghostRef} className={styles.ghost} aria-hidden="true">
            {renderControlSlots()}
          </div>
        )}
      </div>
    );
  }
);

export default InternalControlGroup;
