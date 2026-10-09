// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { BaseComponentProps } from '../../../types/base-component';
import { getBaseProps } from '../../base-component';
import {
  GroupedControlContext,
  GroupedControlDirection,
  GroupedControlPosition,
} from '../../context/control-group-context';
import { useFitsInline } from '../../hooks/use-fits-inline';
import { flattenChildren } from '../../utils/flatten-children';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

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
  /**
   * When set, renders an inline label above the group and associates it with the
   * group via `aria-labelledby`.
   */
  inlineLabelText?: string;
}

const InternalControlGroup = forwardRef<HTMLDivElement, InternalControlGroupProps>(
  ({ children, direction = 'auto', inlineLabelText, ...props }, ref) => {
    const baseProps = getBaseProps(props);
    const labelId = useUniqueId('control-group-label');

    const flattenedChildren = flattenChildren(children, 'ControlGroup');
    const controlCount = flattenedChildren.length;

    // Only `'auto'` measures; a forced direction wins and the ghost is not rendered.
    const { overflows, rootRef, ghostRef } = useFitsInline<HTMLDivElement>();
    const mergedRootRef = useMergeRefs(ref, rootRef);
    const resolvedDirection: GroupedControlDirection =
      direction === 'auto' ? (overflows ? 'vertical' : 'horizontal') : direction;

    const renderControlSlots = () =>
      flattenedChildren.map((child, index) => {
        const key = child && typeof child === 'object' ? (child as Record<'key', unknown>).key : undefined;
        const position: GroupedControlPosition =
          controlCount === 1 ? 'only' : index === 0 ? 'first' : index === controlCount - 1 ? 'last' : 'middle';
        return (
          <div
            key={key ? String(key) : index}
            className={clsx(testUtilStyles.control, styles.control, styles[`control-${position}-${resolvedDirection}`])}
          >
            <GroupedControlContext.Provider value={{ position, direction: resolvedDirection }}>
              {child}
            </GroupedControlContext.Provider>
          </div>
        );
      });

    // The role="group" subtree is identical whether or not a label is present: it keeps our root
    // ref, test class, structural classes, and the measurement ghost (only in `auto` mode). We
    // build it once and place it either bare (spreading baseProps) or inside the inline-label
    // wrapper (where baseProps live on the outer wrapper instead). `extraProps` carries whatever
    // the chosen branch puts on the group div (baseProps when bare, aria-labelledby when labeled)
    // and `className` is any extra class to merge with the structural ones.
    const renderGroup = (extraProps: Record<string, unknown>, className?: string) => (
      <div
        {...extraProps}
        ref={mergedRootRef}
        role="group"
        className={clsx(className, testUtilStyles.root, styles.root, styles[`root-${resolvedDirection}`])}
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

    if (inlineLabelText) {
      // When labeled, the consumer's props/className land on the outer wrapper (matching main);
      // the inner role="group" div keeps the structural classes, ref, and test class.
      return (
        <div
          {...baseProps}
          className={clsx(baseProps.className, testUtilStyles['inline-label-wrapper'], styles['inline-label-wrapper'])}
        >
          <label id={labelId} className={clsx(testUtilStyles['inline-label'], styles['inline-label'])}>
            {inlineLabelText}
          </label>
          <div className={styles['inline-label-trigger-wrapper']}>{renderGroup({ 'aria-labelledby': labelId })}</div>
        </div>
      );
    }

    // When unlabeled, the consumer's props/className land directly on the role="group" root.
    return renderGroup(baseProps as Record<string, unknown>, baseProps.className);
  }
);

export default InternalControlGroup;
