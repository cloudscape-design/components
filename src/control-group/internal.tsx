// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { FormFieldError, FormFieldWarning } from '../form-field/internal';
import { getBaseProps } from '../internal/base-component';
import { ControlGroupContext, ControlGroupPosition } from '../internal/context/control-group-context';
import { FormFieldContext } from '../internal/context/form-field-context';
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
      children,
      description,
      errorText,
      warningText,
      i18nStrings,
      __internalRootRef,
      ...props
    }: InternalControlGroupProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const mergedRef = useMergeRefs(ref, __internalRootRef);
    const baseProps = getBaseProps(props);

    const groupId = useUniqueId('control-group');

    const showWarning = !!warningText && !errorText;
    if (isDevelopment && warningText && errorText) {
      warnOnce('ControlGroup', 'Both `errorText` and `warningText` exist. `warningText` will not be shown.');
    }

    const descriptionId = description ? `${groupId}-description` : undefined;
    const errorId = errorText ? `${groupId}-error` : undefined;
    const warningId = showWarning ? `${groupId}-warning` : undefined;

    // Associate every group-level message with the group, and propagate the same
    // description down to the child controls so screen readers announce it once
    // the focus lands on any control in the group.
    const ariaDescribedby = joinStrings(errorId, warningId, descriptionId) || undefined;

    const invalid = !!errorText;
    const warning = showWarning;

    // See-through fragments and nested arrays so each real control gets its own slot.
    const flattenedChildren = flattenChildren(children, 'ControlGroup');
    const controlCount = flattenedChildren.length;

    return (
      <div
        {...baseProps}
        ref={mergedRef}
        className={clsx(baseProps.className, styles.root, testUtilStyles['control-group'])}
      >
        <div
          role="group"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
          className={clsx(styles.group, invalid && styles.invalid, warning && styles.warning)}
        >
          <FormFieldContext.Provider
            value={{
              invalid,
              warning,
              // Point child controls at the group-level messages without overriding a
              // control's own describedby if it sets one.
              ariaDescribedby,
            }}
          >
            {flattenedChildren.map((child, index) => {
              const key = child && typeof child === 'object' ? (child as Record<'key', unknown>).key : undefined;
              const position: ControlGroupPosition =
                controlCount === 1 ? 'only' : index === 0 ? 'first' : index === controlCount - 1 ? 'last' : 'middle';
              return (
                <div
                  key={key ? String(key) : undefined}
                  className={clsx(styles.control, testUtilStyles['control-group-item'])}
                >
                  <ControlGroupContext.Provider value={{ isInControlGroup: true, position }}>
                    {child}
                  </ControlGroupContext.Provider>
                </div>
              );
            })}
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
