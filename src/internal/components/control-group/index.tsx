// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { BaseComponentProps } from '../../../types/base-component';
import { getBaseProps } from '../../base-component';
import {
  GroupedControlContext,
  GroupedControlDirection,
  GroupedControlPosition,
} from '../../context/control-group-context';
import { flattenChildren } from '../../utils/flatten-children';
import { useResponsiveDirection } from './use-responsive-direction';

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

    const { resolvedDirection, rootRef, ghostRef } = useResponsiveDirection(direction);
    const mergedRootRef = useMergeRefs(ref, rootRef);

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
        ref={mergedRootRef}
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
