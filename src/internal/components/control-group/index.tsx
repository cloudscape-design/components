// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { InternalButton } from '../../../button/internal';
import { getBaseProps } from '../../base-component';
import { GroupedControlContext, GroupedControlPosition } from '../../context/control-group-context';
import { flattenChildren } from '../../utils/flatten-children';
import { ControlGroupProps } from './interfaces';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export { ControlGroupProps };

export default function ControlGroup({
  children,
  direction = 'horizontal',
  inlineLabelText,
  actionButton,
  ...props
}: ControlGroupProps) {
  const baseProps = getBaseProps(props);
  const labelId = useUniqueId('control-group-label');

  const flattenedChildren = flattenChildren(children, 'ControlGroup');
  const controlCount = flattenedChildren.length;

  const rootClassnames = [baseProps.className, testUtilStyles.root];

  // The `role="group"` element wrapping the control slots. When an inline label is
  // present it is labelled by the label; otherwise it carries the component root props.
  const controls = (
    <div
      {...(inlineLabelText ? { 'aria-labelledby': labelId } : actionButton ? {} : baseProps)}
      role="group"
      className={clsx(
        inlineLabelText || actionButton ? undefined : baseProps.className,
        styles.controls,
        styles[`controls-${direction}`],
        !actionButton && !inlineLabelText && rootClassnames
      )}
    >
      {flattenedChildren.map((child, index) => {
        const key = child && typeof child === 'object' ? (child as Record<'key', unknown>).key : undefined;
        const position: GroupedControlPosition =
          controlCount === 1 ? 'only' : index === 0 ? 'first' : index === controlCount - 1 ? 'last' : 'middle';
        return (
          <div
            key={key ? String(key) : index}
            className={clsx(styles.control, styles[`control-${position}-${direction}`])}
          >
            {/* `hasAction` only squares facing corners; the action is never counted as a control. */}
            <GroupedControlContext.Provider value={{ position, direction, hasAction: !!actionButton }}>
              {child}
            </GroupedControlContext.Provider>
          </div>
        );
      })}
    </div>
  );

  const controlsWithAction = actionButton ? (
    <div
      {...(inlineLabelText ? {} : baseProps)}
      className={clsx(styles['group-layout'], styles[`group-layout-${direction}`], !inlineLabelText && rootClassnames)}
    >
      {controls}
      <div className={styles['action-slot']}>
        <InternalButton
          className={testUtilStyles['action-button']}
          variant="icon"
          __groupedControlProps={{ position: 'last', direction: 'horizontal' }}
          iconName={actionButton.iconName}
          iconAlt={actionButton.iconAlt}
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
