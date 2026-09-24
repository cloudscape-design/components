// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useCallback, useLayoutEffect, useRef, useState } from 'react';
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

    // Stack the controls only when they don't fit the available width. The decision
    // compares two independent widths so the group's own collapse can't feed back into
    // it (which would leave it stuck stacked):
    //   - `availableWidth`: the width of the line the group sits on (see below).
    //   - `requiredRowWidth`: the width the controls need as a single row, measured from
    //     a hidden ghost row that is always a row and out of flow, so it never shrinks.
    const [availableWidth, setAvailableWidth] = useState<number | null>(null);
    const [requiredRowWidth, ghostWidthRef] = useContainerQuery<number>(entry => entry.contentBoxWidth);

    // The root is `flex-shrink: 0` (see styles.scss), so it and any shrink-wrapping
    // ancestor take the group's width — including the narrow width after it stacks. So
    // to measure the real available width we walk up and skip those ancestors, stopping
    // at the first one that actually constrains the group. Its width does not follow the
    // collapse, so the group re-expands when the space returns.
    const rootElRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<ResizeObserver | null>(null);

    const measureAvailableWidth = useCallback(() => {
      const root = rootElRef.current;
      if (!root) {
        return;
      }
      const rootWidth = root.getBoundingClientRect().width;
      let container: HTMLElement | null = root.parentElement;
      let available: number | null = null;
      // Walk up (bounded) to the first ancestor that constrains the group, skipping ones
      // that just shrink-wrap to it.
      for (let i = 0; container && i < 20; i++) {
        const style = getComputedStyle(container);
        // clientWidth excludes borders/scrollbar; subtract padding for the content box.
        const paddingInline = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const contentWidth = container.clientWidth - paddingInline;
        available = contentWidth;
        // Wider than the group: this ancestor defines the available width.
        if (contentWidth > rootWidth + 1) {
          break;
        }
        // Not wider, but it clips/scrolls or the group overflows it: it constrains the
        // group, so its (narrower) width is the available width.
        const clipsOrScrolls =
          style.overflowX !== 'visible' ||
          style.overflow !== 'visible' ||
          container.scrollWidth > container.clientWidth;
        if (clipsOrScrolls) {
          break;
        }
        // Otherwise it just shrink-wraps to the group: skip it and keep looking.
        container = container.parentElement;
      }
      setAvailableWidth(available);
    }, []);

    const measureRootRef = useCallback(
      (node: HTMLDivElement | null) => {
        observerRef.current?.disconnect();
        observerRef.current = null;
        rootElRef.current = node;
        if (!node || typeof ResizeObserver === 'undefined') {
          return;
        }
        // Re-run the walk whenever the root or any ancestor resizes.
        const observer = new ResizeObserver(() => measureAvailableWidth());
        observer.observe(node);
        for (let el: HTMLElement | null = node.parentElement, i = 0; el && i < 20; i++, el = el.parentElement) {
          observer.observe(el);
        }
        observerRef.current = observer;
        measureAvailableWidth();
      },
      [measureAvailableWidth]
    );
    const rootMeasureRef = useMergeRefs(mergedRef, measureRootRef);

    useLayoutEffect(() => () => observerRef.current?.disconnect(), []);

    // Stack when the row doesn't fit; the tolerance avoids flipping on sub-pixel
    // rounding. Stay a row until both widths are measured.
    const stacked =
      availableWidth !== null && requiredRowWidth !== null ? availableWidth < requiredRowWidth - 1 : false;

    // Renders the control slots (and the dismiss button) for both the visible group and
    // the ghost. The ghost always renders as a row (`isStacked === false`) so its
    // measured width doesn't depend on the current collapse state.
    const renderControlSlots = (isStacked: boolean) => (
      <>
        {flattenedChildren.map((child, index) => {
          const key = child && typeof child === 'object' ? (child as Record<'key', unknown>).key : undefined;
          const position = getPosition(index);
          // When the group wraps (stacks) the controls fuse vertically: the block-axis
          // seam overlaps just like the inline seam does in a row. A control only
          // detaches (keeps a gap and its own rounded corners) if it genuinely renders a
          // visible inline label; the built-in dismiss button also stands alone. So a
          // control is labeled when it has an inline label, and it precedes a detached
          // control when the next control is labeled or it is the last real control
          // before the dismiss button.
          const hasInlineLabel = hasInlineLabelProp(child);
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
                value={{
                  isInControlGroup: true,
                  position,
                  hasInlineLabel,
                  precedesDetached,
                  stacked: isStacked,
                }}
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
                stacked: isStacked,
                // The dismiss button has no validation state of its own; pass the
                // group's state so it paints its border (incl. the seam with the last
                // control) to continue the unit error/warning styling.
                invalid,
                warning,
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
      </>
    );

    return (
      <div
        {...baseProps}
        ref={rootMeasureRef}
        className={clsx(baseProps.className, styles.root, stacked && styles.stacked, testUtilStyles['control-group'])}
      >
        <div
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
            {renderControlSlots(stacked)}
          </FormFieldContext.Provider>
        </div>

        {/*
          Hidden ghost row, used only to measure the width the controls need as a single
          row. It is always a row, `aria-hidden`, and out of flow, so its width is
          stable regardless of whether the visible group has stacked.
        */}
        <div ref={ghostWidthRef} className={styles.ghost} aria-hidden="true">
          <div className={clsx(styles.group, invalid && styles.invalid, warning && styles.warning)}>
            {renderControlSlots(false)}
          </div>
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
