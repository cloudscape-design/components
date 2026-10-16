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

  const { overflows, rootRef, ghostRef, sensorRef } = useFitsInline<HTMLDivElement>();
  const resolvedDirection: GroupedControlDirection =
    direction === 'auto' ? (overflows ? 'vertical' : 'horizontal') : direction;

  const rootClassnames = [styles.root, baseProps.className, testUtilStyles.root];

  const renderControlSlots = (isGhost: boolean) => {
    const slotDirection: GroupedControlDirection = isGhost
      ? 'horizontal' // The ghost always uses horizontal mode for measuring
      : resolvedDirection;
    return flattenedChildren.map((child, index) => {
      const key = child && typeof child === 'object' ? (child as Record<'key', unknown>).key : undefined;
      const position: GroupedControlPosition =
        controlCount === 1 ? 'only' : index === 0 ? 'first' : index === controlCount - 1 ? 'last' : 'middle';
      return (
        <div
          key={key !== null && key !== undefined ? String(key) : index}
          className={clsx(
            // Make sure that test utils exclude the ghost
            !isGhost && testUtilStyles.control,
            styles.control,
            styles[`control-${position}-${slotDirection}`]
          )}
        >
          <GroupedControlContext.Provider value={{ position, direction: slotDirection, hasAction: !!actionButton }}>
            {child}
          </GroupedControlContext.Provider>
        </div>
      );
    });
  };

  const renderActionButton = (isGhost: boolean) =>
    actionButton ? (
      <div className={styles['action-slot']}>
        <InternalButton
          // Only the real action button carries the test-util class, so test utils exclude the ghost copy.
          className={isGhost ? undefined : testUtilStyles['action-button']}
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
    ) : null;

  // A single render path for both the real row and the ghost copy, so the ghost measures the whole
  // row (controls + action button, including the overlap seam between them) as one unit. The ghost
  // copy carries no role, no aria-labelledby, no base props, and no test-util classes.
  const renderRow = (isGhost: boolean) => {
    const slotDirection: GroupedControlDirection = isGhost ? 'horizontal' : resolvedDirection;
    return (
      <div className={clsx(styles.row, styles[`row-${slotDirection}`])}>
        <div
          {...(isGhost ? {} : inlineLabelText ? { role: 'group', 'aria-labelledby': labelId } : { role: 'group' })}
          className={clsx(styles.controls, styles[`controls-${slotDirection}`])}
        >
          {renderControlSlots(isGhost)}
        </div>
        {renderActionButton(isGhost)}
      </div>
    );
  };

  const rowWrapper = (
    <div
      {...(inlineLabelText ? {} : baseProps)}
      ref={rootRef}
      className={clsx(styles['row-wrapper'], !inlineLabelText && rootClassnames)}
    >
      {renderRow(false)}

      {direction === 'auto' && (
        <>
          <div ref={sensorRef} className={styles.sensor} aria-hidden="true" />
          <div className={styles['ghost-wrapper']}>
            <div ref={ghostRef} className={styles.ghost} aria-hidden="true">
              {renderRow(true)}
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (inlineLabelText) {
    return (
      <div {...baseProps} className={clsx(...rootClassnames, styles['inline-label-wrapper'])}>
        <label id={labelId} className={clsx(styles['inline-label'], testUtilStyles['inline-label'])}>
          {inlineLabelText}
        </label>
        <div className={styles['inline-label-trigger-wrapper']}>{rowWrapper}</div>
      </div>
    );
  }

  return rowWrapper;
}
