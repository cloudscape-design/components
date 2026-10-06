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

// The prop widens the shared two-value `GroupedControlDirection` with `'auto'`, which only
// exists at the component boundary: `'auto'` measures and resolves to a concrete axis before
// anything reaches context, classes, or SCSS.
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

    // Stack the controls only when they don't fit the available width. The decision
    // compares two independent widths so the group's own collapse can't feed back into it
    // (which would leave it stuck stacked):
    //   - `availableWidth`: the width of the line the group sits on (see below).
    //   - `requiredRowWidth`: the width the controls need as a single row, measured from a
    //     hidden ghost row that is always a row and out of flow, so it never shrinks.
    const [availableWidth, setAvailableWidth] = useState<number | null>(null);
    const [requiredRowWidth, ghostWidthRef] = useContainerQuery<number>(entry => entry.contentBoxWidth);

    // The root is `flex-shrink: 0` (see styles.scss), so it and any shrink-wrapping
    // ancestor take the group's width — including the narrow width after it stacks. So to
    // measure the real available width we walk up and skip those ancestors, stopping at the
    // first one that actually constrains the group. Its width does not follow the collapse,
    // so the group re-expands when the space returns.
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
      // Walk up (bounded) to the first ancestor that constrains the group, skipping ones
      // that just shrink-wrap to it.
      for (let i = 0; container && i < 20; i++) {
        const style = getComputedStyle(container);
        // clientWidth excludes borders/scrollbar; subtract padding for the content box.
        const paddingInline = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const contentWidth = container.clientWidth - paddingInline;
        available = contentWidth;
        // Wider than the group: this ancestor defines the available width.
        if (contentWidth > rootWidth + 1) {
          break;
        }
        // Not wider, but it clips/scrolls or the group overflows it: it constrains the
        // group, so its (narrower) width is the available width.
        const clipsOrScrolls =
          style.overflowX !== 'visible' ||
          style.overflow !== 'visible' ||
          container.scrollWidth > container.clientWidth;
        if (clipsOrScrolls) {
          break;
        }
        // Otherwise it just shrink-wraps to the group: skip it and keep looking.
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

    // The ghost row renders a full duplicate of the controls for width measurement. It is
    // visually hidden and out of flow, but its inputs/selects/buttons would still be in the
    // tab order (and announced), adding phantom tab stops between control groups. Mark the
    // whole subtree `inert` so it is non-focusable and hidden from assistive tech. Set
    // imperatively via a ref because `inert` isn't rendered by React < 19.
    const ghostElRef = useRef<HTMLDivElement | null>(null);
    useLayoutEffect(() => {
      if (ghostElRef.current) {
        ghostElRef.current.inert = true;
      }
    });
    const ghostRef = useMergeRefs(ghostWidthRef, ghostElRef);

    // Decide the layout. In `auto` mode: measure and stack the controls as one unit when the
    // row doesn't fit. The `-1` tolerance avoids flipping on sub-pixel rounding; the group
    // stays a row until both widths are measured (the documented fallback).
    const stacked =
      availableWidth !== null && requiredRowWidth !== null ? availableWidth < requiredRowWidth - 1 : false;

    // Resolve the component-level `direction` (which may be `'auto'`) into the two-value
    // `GroupedControlDirection` that feeds the root class, every control class, and the
    // context. A forced direction wins and ignores the measurement; `'auto'` uses `stacked`.
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
        Hidden ghost row, used only to measure the width the controls need as a single
        row. It is always a row, `aria-hidden`, inert (set via ref above), and out of
        flow, so its width is stable regardless of whether the visible group has stacked.
        It duplicates the same children, which is why consumers that probe the DOM by
        test id can match both the real and ghost copy. Only rendered in `auto` mode,
        since a forced direction needs no measurement.
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
