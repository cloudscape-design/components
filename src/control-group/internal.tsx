// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
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

// A control renders a visible inline label when it is passed `inlineLabelText`
// (supported by Input, Select, Multiselect, ...). We read it off the child element's
// props so the group can keep labeled controls from collapsing when it wraps.
function hasInlineLabelProp(child: React.ReactNode): boolean {
  return (
    React.isValidElement<{ inlineLabelText?: string }>(child) &&
    typeof child.props.inlineLabelText === 'string' &&
    child.props.inlineLabelText.length > 0
  );
}

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
    if (isDevelopment && dismissible && !i18nStrings?.dismissText && !i18nStrings?.dismissAriaLabel) {
      warnOnce(
        'ControlGroup',
        'You should provide `i18nStrings.dismissText` (or `i18nStrings.dismissAriaLabel`) to name the remove button when `dismissible` is set.'
      );
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

    // Responsive stacking: the controls collapse to a vertical layout only when they
    // truly don't fit in the available width (not at a fixed pixel breakpoint). We
    // observe the available width on the root, and compare it against the row's
    // required width measured from the group's `scrollWidth` while it is laid out as a
    // row. The required width is only re-read in row mode and kept in a ref, so once
    // stacked the group only expands back to a row when the container grows past that
    // remembered width — this hysteresis prevents oscillation.
    const groupRef = useRef<HTMLDivElement>(null);
    const requiredRowWidthRef = useRef<number | null>(null);
    const [stacked, setStacked] = useState(false);
    const [availableWidth, widthMeasureRef] = useContainerQuery<number>(entry => entry.contentBoxWidth);
    const rootMeasureRef = useMergeRefs(mergedRef, widthMeasureRef);

    useLayoutEffect(() => {
      const group = groupRef.current;
      if (!group || availableWidth === null) {
        return;
      }
      // In row mode, `scrollWidth` is the full width the controls need (the group does
      // not wrap). Remember it so the decision is stable once we stack.
      if (!stacked) {
        requiredRowWidthRef.current = group.scrollWidth;
      }
      const required = requiredRowWidthRef.current;
      if (required === null) {
        return;
      }
      // Small tolerance to avoid flipping on sub-pixel rounding.
      const nextStacked = availableWidth < required - 1;
      if (nextStacked !== stacked) {
        setStacked(nextStacked);
      }
    }, [availableWidth, stacked]);

    return (
      <div
        {...baseProps}
        ref={rootMeasureRef}
        className={clsx(baseProps.className, styles.root, stacked && styles.stacked, testUtilStyles['control-group'])}
      >
        <div
          ref={groupRef}
          role="group"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={groupAriaDescribedby}
          className={clsx(
            styles.group,
            stacked && styles.stacked,
            invalid && styles.invalid,
            warning && styles.warning
          )}
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
              // A control with a visible inline label should not fuse into the
              // previous control when the group wraps (stacks): it keeps its spacing
              // and its rounded top corners instead of collapsing the shared seam.
              const hasInlineLabel = hasInlineLabelProp(child);
              // The control directly above a control that detaches when the group
              // wraps must keep its bottom corners squared, so it does not round off
              // against the gap. A control detaches if it has a visible inline label,
              // or if it is the last real child followed by the standalone dismiss
              // button.
              const isLastRealChild = index === flattenedChildren.length - 1;
              const precedesDetached =
                hasInlineLabelProp(flattenedChildren[index + 1]) || (isLastRealChild && !!dismissible);
              return (
                <div
                  key={key ? String(key) : undefined}
                  className={clsx(
                    styles.control,
                    styles[`control-${position}`],
                    hasInlineLabel && styles['control-labeled'],
                    testUtilStyles['control-group-item']
                  )}
                >
                  <ControlGroupContext.Provider
                    value={{ isInControlGroup: true, position, hasInlineLabel, precedesDetached, stacked }}
                  >
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
                  styles['control-standalone'],
                  testUtilStyles['control-group-item']
                )}
              >
                <ControlGroupContext.Provider
                  value={{
                    isInControlGroup: true,
                    position: getPosition(controlCount - 1),
                    standaloneWhenStacked: true,
                    stacked,
                  }}
                >
                  {/*
                    One button renders both the close icon and the "Remove" text.
                    CSS shows only the icon (square icon-button look) while the group
                    is laid out in a row, and swaps to the text (primary button) when
                    the group wraps. See `in-control-group-standalone` in button styles.
                  */}
                  <InternalButton
                    variant="primary"
                    iconName="close"
                    formAction="none"
                    ariaLabel={i18nStrings?.dismissAriaLabel ?? i18nStrings?.dismissText}
                    className={testUtilStyles['dismiss-button']}
                    onClick={() => fireNonCancelableEvent(onDismiss)}
                  >
                    {i18nStrings?.dismissText}
                  </InternalButton>
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
