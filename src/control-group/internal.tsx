// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import InternalButton from '../button/internal';
import { FormFieldError, FormFieldWarning } from '../form-field/internal';
import { getBaseProps } from '../internal/base-component';
import { ControlGroupContext, ControlGroupPosition } from '../internal/context/control-group-context';
import { FormFieldContext, useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import { isDevelopment } from '../internal/is-development';
import { flattenChildren } from '../internal/utils/flatten-children';
import { joinStrings } from '../internal/utils/strings/join-strings';
import { InternalControlGroupProps } from './internal-interfaces';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

const InternalControlGroup = forwardRef(
  (
    {
      ariaLabel,
      ariaLabelledby,
      children,
      description,
      errorText,
      warningText,
      dismissible,
      onDismiss,
      i18nStrings,
      __internalRootRef,
      ...props
    }: InternalControlGroupProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const mergedRef = useMergeRefs(ref, __internalRootRef);
    const baseProps = getBaseProps(props);

    const groupId = useUniqueId('control-group');

    // Inherit validation/description wiring from an enclosing FormField (if any),
    // matching how FormField itself merges with its parent context.
    const {
      ariaDescribedby: parentAriaDescribedby,
      invalid: parentInvalid,
      warning: parentWarning,
    } = useFormFieldContext({});

    const showWarning = !!warningText && !errorText;
    if (isDevelopment && warningText && errorText) {
      warnOnce('ControlGroup', 'Both `errorText` and `warningText` exist. `warningText` will not be shown.');
    }
    if (isDevelopment && !ariaLabel && !ariaLabelledby) {
      warnOnce('ControlGroup', 'You should provide either `ariaLabel` or `ariaLabelledby` to name the group.');
    }
    if (isDevelopment && dismissible && !i18nStrings?.dismissAriaLabel) {
      warnOnce('ControlGroup', 'You should provide `i18nStrings.dismissAriaLabel` when `dismissible` is set.');
    }

    const descriptionId = description ? `${groupId}-description` : undefined;
    const errorId = errorText ? `${groupId}-error` : undefined;
    const warningId = showWarning ? `${groupId}-warning` : undefined;

    // Associate the group-level messages with the group, and propagate the same
    // description down to the child controls (merged with any describedby coming
    // from an enclosing FormField) so screen readers announce it. This mirrors how
    // FormField wires `aria-describedby` through the form-field context.
    const groupAriaDescribedby = joinStrings(errorId, warningId, descriptionId) || undefined;
    const childAriaDescribedby = joinStrings(parentAriaDescribedby, groupAriaDescribedby) || undefined;

    const invalid = !!errorText || !!parentInvalid;
    const warning = (showWarning || (!!parentWarning && !parentInvalid)) && !errorText;

    // See-through fragments and nested arrays so each real control gets its own slot.
    const flattenedChildren = flattenChildren(children, 'ControlGroup');
    // The internal remove button (when `dismissible`) counts as an extra trailing
    // control so positions (first/middle/last/only) stay correct.
    const controlCount = flattenedChildren.length + (dismissible ? 1 : 0);
    const getPosition = (index: number): ControlGroupPosition =>
      controlCount === 1 ? 'only' : index === 0 ? 'first' : index === controlCount - 1 ? 'last' : 'middle';

    return (
      <div
        {...baseProps}
        ref={mergedRef}
        className={clsx(baseProps.className, styles.root, testUtilStyles['control-group'])}
      >
        <div
          role="group"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={groupAriaDescribedby}
          className={clsx(styles.group, invalid && styles.invalid, warning && styles.warning)}
        >
          <FormFieldContext.Provider
            value={{
              invalid,
              warning,
              // Point child controls at the group-level messages (merged with any
              // describedby inherited from an enclosing FormField), matching how
              // FormField propagates aria-describedby through this context.
              ariaDescribedby: childAriaDescribedby,
            }}
          >
            {flattenedChildren.map((child, index) => {
              const key = child && typeof child === 'object' ? (child as Record<'key', unknown>).key : undefined;
              const position = getPosition(index);
              return (
                <div
                  key={key ? String(key) : undefined}
                  className={clsx(styles.control, styles[`control-${position}`], testUtilStyles['control-group-item'])}
                >
                  <ControlGroupContext.Provider value={{ isInControlGroup: true, position }}>
                    {child}
                  </ControlGroupContext.Provider>
                </div>
              );
            })}
            {dismissible && (
              <div
                className={clsx(
                  styles.control,
                  styles[`control-${getPosition(controlCount - 1)}`],
                  testUtilStyles['control-group-item']
                )}
              >
                <ControlGroupContext.Provider
                  value={{ isInControlGroup: true, position: getPosition(controlCount - 1) }}
                >
                  <InternalButton
                    variant="icon"
                    iconName="close"
                    formAction="none"
                    ariaLabel={i18nStrings?.dismissAriaLabel}
                    className={testUtilStyles['dismiss-button']}
                    onClick={() => fireNonCancelableEvent(onDismiss)}
                  />
                </ControlGroupContext.Provider>
              </div>
            )}
          </FormFieldContext.Provider>
        </div>

        {(errorText || showWarning || description) && (
          <div className={styles.hints}>
            {errorText && (
              <FormFieldError id={errorId} errorIconAriaLabel={i18nStrings?.errorIconAriaLabel}>
                {errorText}
              </FormFieldError>
            )}
            {showWarning && (
              <FormFieldWarning id={warningId} warningIconAriaLabel={i18nStrings?.warningIconAriaLabel}>
                {warningText}
              </FormFieldWarning>
            )}
            {description && (
              <div id={descriptionId} className={clsx(styles.description, testUtilStyles.description)}>
                {description}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default InternalControlGroup;
