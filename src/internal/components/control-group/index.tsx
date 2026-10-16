// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { InternalButton } from '../../../button/internal';
import { getBaseProps } from '../../base-component';
import { GroupedControlContext, GroupedControlPosition } from '../../context/control-group-context';
import { FormFieldContext, useFormFieldContext } from '../../context/form-field-context';
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

  const formFieldContext = useFormFieldContext({});
  const isInvalid = !!formFieldContext.invalid;
  const isWarning = !!formFieldContext.warning && !isInvalid;

  const flattenedChildren = flattenChildren(children, 'ControlGroup');
  const controlCount = flattenedChildren.length;

  const rootClassnames = [styles.root, baseProps.className, testUtilStyles.root];

  const controls = (
    <div
      {...(inlineLabelText ? { 'aria-labelledby': labelId } : actionButton ? {} : baseProps)}
      role="group"
      className={clsx(
        styles.controls,
        styles[`controls-${direction}`],
        isInvalid && styles['controls-invalid'],
        isWarning && styles['controls-warning'],
        actionButton && styles['controls-with-action'],
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
            <GroupedControlContext.Provider
              value={{
                position,
                direction,
                hasAction: !!actionButton,
                validation: isInvalid ? 'error' : isWarning ? 'warning' : null,
              }}
            >
              {/* Mask the form-field flags so inner controls do not color their own seams. */}
              <FormFieldContext.Provider value={{ ...formFieldContext, invalid: false, warning: false }}>
                {child}
              </FormFieldContext.Provider>
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
          className={clsx(testUtilStyles['action-button'])}
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
