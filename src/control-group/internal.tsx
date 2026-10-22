// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { InternalButton } from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import {
  GroupedControlContext,
  GroupedControlDirection,
  GroupedControlPosition,
} from '../internal/context/control-group-context';
import { FormFieldContext, useFormFieldContext } from '../internal/context/form-field-context';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useFitsInline } from '../internal/hooks/use-fits-inline';
import { flattenChildren } from '../internal/utils/flatten-children';
import { joinStrings } from '../internal/utils/strings/join-strings';
import { ControlGroupProps } from './interfaces';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export default function InternalControlGroup({
  children,
  direction = 'auto',
  inlineLabelText,
  actionButton,
  __internalRootRef,
  ...props
}: ControlGroupProps & InternalBaseComponentProps) {
  const baseProps = getBaseProps(props);
  const labelId = useUniqueId('control-group-label');

  const formFieldContext = useFormFieldContext({});
  const isInvalid = !!formFieldContext.invalid;
  const isWarning = !!formFieldContext.warning && !isInvalid;

  // The parent FormField's validation (describedby/invalid) and label associate with the group as a
  // unit, not the inner controls (whose FormField context is reset below).
  // Merge FormField's label id (first) with the internal inline label when present.
  const groupAriaLabelledby = joinStrings(formFieldContext.ariaLabelledby, inlineLabelText ? labelId : undefined);
  const groupAriaDescribedby = joinStrings(formFieldContext.ariaDescribedby);

  const flattenedChildren = flattenChildren(children, 'ControlGroup');
  const controlCount = flattenedChildren.length;

  const { fits, ghostRef, sensorRef } = useFitsInline<HTMLDivElement>();
  const resolvedDirection: GroupedControlDirection =
    direction === 'auto' ? (fits ? 'horizontal' : 'vertical') : direction;

  const rootClassnames = [styles.root, baseProps.className, testUtilStyles.root];

  const renderControlSlots = (isGhost: boolean) => {
    const slotDirection: GroupedControlDirection = isGhost
      ? 'horizontal' // The ghost always uses horizontal mode for measuring
      : resolvedDirection;
    return flattenedChildren.map((child, index) => {
      const key = child && typeof child === 'object' ? (child as Record<'key', unknown>).key : undefined;
      const position: GroupedControlPosition =
        controlCount === 1 ? 'only' : index === 0 ? 'first' : index === controlCount - 1 ? 'last' : 'middle';
      const isLeading = slotDirection === 'vertical' || position === 'first' || position === 'only';
      return (
        <div
          key={key !== null && key !== undefined ? String(key) : index}
          className={clsx(
            // Make sure that test utils exclude the ghost
            !isGhost && testUtilStyles.control,
            styles.control,
            styles[`control-${position}-${slotDirection}`],
            isLeading && (isInvalid || isWarning) && styles['control-validation'],
            isLeading && isInvalid && styles['control-in-error'],
            isLeading && isWarning && styles['control-in-warning']
          )}
        >
          <GroupedControlContext.Provider
            value={{
              position,
              direction: slotDirection,
              hasAction: !!actionButton,
              validation: isInvalid ? 'error' : isWarning ? 'warning' : null,
            }}
          >
            <FormFieldContext.Provider value={{}}>{child}</FormFieldContext.Provider>
          </GroupedControlContext.Provider>
        </div>
      );
    });
  };

  const renderActionButton = (isGhost: boolean) =>
    actionButton ? (
      <div className={styles['action-slot']}>
        <InternalButton
          // Make sure that test utils exclude the ghost
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

  // A single render path for both the real group layout and the ghost copy, so the ghost measures
  // the whole group (controls + action button, including the overlap seam between them) as one unit.
  // The ghost copy carries no role, no aria wiring, no base props, and no test-util classes.
  const renderGroupLayout = (isGhost: boolean) => {
    const slotDirection: GroupedControlDirection = isGhost ? 'horizontal' : resolvedDirection;
    return (
      <div className={clsx(styles['group-layout'], styles[`group-layout-${slotDirection}`])}>
        <div
          {...(isGhost
            ? {}
            : {
                role: 'group',
                'aria-labelledby': groupAriaLabelledby,
                'aria-describedby': groupAriaDescribedby,
                'aria-invalid': isInvalid ? 'true' : undefined,
              })}
          className={clsx(styles.controls, styles[`controls-${slotDirection}`])}
        >
          {renderControlSlots(isGhost)}
        </div>
        {renderActionButton(isGhost)}
      </div>
    );
  };

  const groupLayoutWrapper = (
    <div
      {...(inlineLabelText ? {} : baseProps)}
      ref={inlineLabelText ? undefined : __internalRootRef}
      className={clsx(styles['group-layout-wrapper'], !inlineLabelText && rootClassnames)}
    >
      {renderGroupLayout(false)}

      {direction === 'auto' && (
        <>
          <div ref={sensorRef} className={styles.sensor} aria-hidden="true" />
          <div className={styles['ghost-anchor']}>
            <div ref={ghostRef} className={styles.ghost} aria-hidden="true">
              {renderGroupLayout(true)}
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (inlineLabelText) {
    return (
      <div {...baseProps} ref={__internalRootRef} className={clsx(...rootClassnames, styles['inline-label-wrapper'])}>
        <label id={labelId} className={clsx(styles['inline-label'], testUtilStyles['inline-label'])}>
          {inlineLabelText}
        </label>
        <div className={styles['inline-label-trigger-wrapper']}>{groupLayoutWrapper}</div>
      </div>
    );
  }

  return groupLayoutWrapper;
}
