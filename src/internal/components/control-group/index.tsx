// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { InternalButton } from '../../../button/internal';
import { getBaseProps } from '../../base-component';
import {
  GroupedControlContext,
  GroupedControlDirection,
  GroupedControlPosition,
} from '../../context/control-group-context';
import { useFitsInline } from '../../hooks/use-fits-inline';
import { flattenChildren } from '../../utils/flatten-children';
import { ControlGroupProps } from './interfaces';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export { ControlGroupProps };

export default function ControlGroup({
  children,
  direction = 'auto',
  inlineLabelText,
  actionButton,
  ...props
}: ControlGroupProps) {
  const baseProps = getBaseProps(props);
  const labelId = useUniqueId('control-group-label');

  const flattenedChildren = flattenChildren(children, 'ControlGroup');
  const controlCount = flattenedChildren.length;

  // Only `'auto'` measures; a forced direction wins and the ghost is not rendered. The sensor
  // reports the available width, the ghost the required single-row width; the comparison decides
  // whether the controls stack. The resolved axis is a concrete GroupedControlDirection, so
  // `'auto'` never reaches the context, classes, or SCSS.
  const { overflows, rootRef, ghostRef, sensorRef } = useFitsInline<HTMLDivElement>();
  const resolvedDirection: GroupedControlDirection =
    direction === 'auto' ? (overflows ? 'vertical' : 'horizontal') : direction;

  const rootClassnames = [styles.root, baseProps.className, testUtilStyles.root];

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
          <GroupedControlContext.Provider value={{ position, direction: resolvedDirection, hasAction: !!actionButton }}>
            {child}
          </GroupedControlContext.Provider>
        </div>
      );
    });

  const controls = (
    <div
      {...(inlineLabelText ? { 'aria-labelledby': labelId } : actionButton ? {} : baseProps)}
      ref={rootRef}
      role="group"
      className={clsx(
        styles.controls,
        styles[`controls-${resolvedDirection}`],
        !actionButton && !inlineLabelText && rootClassnames
      )}
    >
      {renderControlSlots()}

      {/*
        Measurement helpers, only needed in `auto` mode:
        - The sensor fills the inline space available to the group but has no intrinsic width,
          so its measured width is the real available width (not the group's shrunk width).
        - The ghost duplicates the controls as a single row to measure their required width,
          out of flow so its width is stable when the visible group stacks. It is absolutely
          positioned, so it gets its own zero-size relative wrapper to anchor against (the root
          is `position: static` so the sensor can escape the group's collapse).
      */}
      {direction === 'auto' && (
        <>
          <div ref={sensorRef} className={styles.sensor} aria-hidden="true" />
          <div className={styles['ghost-wrapper']}>
            <div ref={ghostRef} className={styles.ghost} aria-hidden="true">
              {renderControlSlots()}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const controlsWithAction = actionButton ? (
    <div
      {...(inlineLabelText ? {} : baseProps)}
      className={clsx(
        styles['group-layout'],
        styles[`group-layout-${resolvedDirection}`],
        !inlineLabelText && rootClassnames
      )}
    >
      {controls}
      <div className={styles['action-slot']}>
        <InternalButton
          className={testUtilStyles['action-button']}
          variant="control-group-action"
          formAction="none"
          iconName={actionButton.iconName}
          ariaLabel={actionButton.ariaLabel}
          disabled={actionButton.disabled}
          disabledReason={actionButton.disabledReason}
          ariaDescribedby={actionButton.ariaDescribedby}
          onClick={actionButton.onClick}
        />
      </div>
    </div>
  ) : (
    controls
  );

  if (inlineLabelText) {
    return (
      <div {...baseProps} className={clsx(...rootClassnames, styles['inline-label-wrapper'])}>
        <label id={labelId} className={clsx(styles['inline-label'], testUtilStyles['inline-label'])}>
          {inlineLabelText}
        </label>
        <div className={styles['inline-label-trigger-wrapper']}>{controlsWithAction}</div>
      </div>
    );
  }

  return controlsWithAction;
}
