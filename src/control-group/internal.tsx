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
      inlineLabelText,
      children,
      description,
      errorText,
      warningText,
      dismissible,
      onDismiss,
      actions,
      actionsPosition = 'inline',
      wrapBehavior = 'auto',
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
    if (isDevelopment && !ariaLabel && !ariaLabelledby && !inlineLabelText) {
      warnOnce(
        'ControlGroup',
        'You should provide `ariaLabel`, `ariaLabelledby`, or `inlineLabelText` to name the group.'
      );
    }
    if (isDevelopment && dismissible && !i18nStrings?.dismissText && !i18nStrings?.dismissAriaLabel) {
      warnOnce(
        'ControlGroup',
        'You should provide `i18nStrings.dismissText` (or `i18nStrings.dismissAriaLabel`) to name the remove button when `dismissible` is set.'
      );
    }
    if (isDevelopment && dismissible && actions) {
      warnOnce('ControlGroup', 'Both `dismissible` and `actions` are set. `actions` will not be shown.');
    }

    const descriptionId = description ? `${groupId}-description` : undefined;
    const errorId = errorText ? `${groupId}-error` : undefined;
    const warningId = showWarning ? `${groupId}-warning` : undefined;
    const inlineLabelId = inlineLabelText ? `${groupId}-label` : undefined;

    // The group's accessible name: an explicit `ariaLabelledby`, the visible inline
    // label (when set), then any of both. `ariaLabel` is applied separately below.
    const groupAriaLabelledby = joinStrings(ariaLabelledby, inlineLabelId) || undefined;

    // Associate the group-level messages with the group, and propagate the same
    // description down to the child controls (merged with any describedby coming
    // from an enclosing FormField) so screen readers announce it. This mirrors how
    // FormField wires `aria-describedby` through the form-field context.
    const groupAriaDescribedby = joinStrings(errorId, warningId, descriptionId) || undefined;
    const childAriaDescribedby = joinStrings(parentAriaDescribedby, groupAriaDescribedby) || undefined;

    const invalid = !!errorText || !!parentInvalid;
    const warning = (showWarning || (!!parentWarning && !parentInvalid)) && !errorText;

    // `children` may be a render function that returns different controls depending on
    // whether the group wraps. Resolve it for a given wrap state, then flatten (see-
    // through fragments and nested arrays) so each real control gets its own slot. When
    // `children` is a plain node the same content is used for every wrap state.
    const isRenderFunction = typeof children === 'function';
    const resolveChildren = (wrap: boolean) =>
      flattenChildren(
        isRenderFunction ? (children as (state: { wrap: boolean }) => React.ReactNode)({ wrap }) : children,
        'ControlGroup'
      );

    // `actions` renders a custom trailing slot (for example a remove button). Like
    // `children`, it can be a render function that returns different content per wrap
    // state. The built-in `dismissible` button takes precedence, so `actions` is only
    // used when `dismissible` is not set.
    const isActionsRenderFunction = typeof actions === 'function';
    const resolveActions = (wrap: boolean): React.ReactNode =>
      isActionsRenderFunction ? (actions as (state: { wrap: boolean }) => React.ReactNode)({ wrap }) : actions;
    // Whether a trailing standalone slot is rendered at all (built-in dismiss or custom
    // actions). `actions` may resolve to falsy content, so treat that as no slot.
    const hasCustomActions = !dismissible && actions !== null && actions !== undefined && actions !== false;

    // A custom `actions` button can sit at the group's END SIDE when the group wraps
    // (`actionsPosition="side"`): the controls stack in a column on the leading side and
    // the button spans the full height beside them. This only applies to a custom
    // `actions` slot (not the built-in dismiss), and only once the group is stacked.
    const sideActions = actionsPosition === 'side' && hasCustomActions;

    // The trailing standalone slot (the built-in remove button when `dismissible`, or
    // custom `actions`) counts as an extra control, so positions (first/middle/last/only)
    // are computed against the resolved controls plus that slot.
    const getControlCount = (flattened: Array<React.ReactNode>) =>
      flattened.length + (dismissible || hasCustomActions ? 1 : 0);
    const getPosition = (index: number, controlCount: number): ControlGroupPosition =>
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

    // The ghost row renders a full duplicate of the controls for width measurement. It is
    // visually hidden and out of flow, but its inputs/selects/buttons would still be in
    // the tab order (and announced), adding phantom tab stops between control groups. Mark
    // the whole subtree `inert` so it is non-focusable and hidden from assistive tech.
    // Set imperatively via a ref because `inert` isn't rendered by React < 19 (see
    // live-region / expandable-section for the same pattern).
    const ghostElRef = useRef<HTMLDivElement | null>(null);
    useLayoutEffect(() => {
      if (ghostElRef.current) {
        ghostElRef.current.inert = true;
      }
    });
    const ghostRef = useMergeRefs(ghostWidthRef, ghostElRef);

    // Decide the layout. `wrapBehavior` controls this top-down: `"wrap"` and `"nowrap"`
    // force the stacked / row layout regardless of width, while `"auto"` (default)
    // measures and stacks only when the row doesn't fit (the tolerance avoids flipping
    // on sub-pixel rounding; it stays a row until both widths are measured).
    const measuredStacked =
      availableWidth !== null && requiredRowWidth !== null ? availableWidth < requiredRowWidth - 1 : false;
    const stacked = wrapBehavior === 'wrap' ? true : wrapBehavior === 'nowrap' ? false : measuredStacked;

    // The group-level error / warning messages. When the group wraps (stacks), these are
    // rendered inside the group between the controls and the dismiss button; otherwise
    // they render in the hints block below the group (the description always stays
    // below). Kept as a single element so it can be placed in either location.
    const validationMessages =
      errorText || showWarning ? (
        <>
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
        </>
      ) : null;

    // Renders the control slots for a given wrap state. The ghost always renders as a
    // row (`isStacked === false`) so its measured width doesn't depend on the current
    // collapse state; when `children` is a render function the ghost also measures the
    // non-wrapped content, which is what a row would need.
    const renderControlSlots = (
      isStacked: boolean,
      flattened: Array<React.ReactNode>,
      controlCount: number,
      isGhost: boolean
    ) =>
      flattened.map((child, index) => {
        const key = child && typeof child === 'object' ? (child as Record<'key', unknown>).key : undefined;
        const position = getPosition(index, controlCount);
        // When the group wraps (stacks) the controls fuse vertically: the block-axis
        // seam overlaps just like the inline seam does in a row. A control only detaches
        // (keeps a gap and its own rounded corners) if it genuinely renders a visible
        // inline label; the built-in dismiss button also stands alone. A trailing custom
        // `actions` button, by contrast, stays attached (fuses vertically), so the last
        // real control before it keeps its seam. So a control is labeled when it has an
        // inline label, and it precedes a detached control when the next control is
        // labeled or it is the last real control before the built-in dismiss button.
        const hasInlineLabel = hasInlineLabelProp(child);
        const isLastRealChild = index === flattened.length - 1;
        const precedesDetached = hasInlineLabelProp(flattened[index + 1]) || (isLastRealChild && !!dismissible);
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
                // In side mode the controls stack in a column with the button fused on
                // their END side, so a control's end-side corners stay squared (only the
                // leading/outer corners round). The controls need to know this.
                sideActions: sideActions && isStacked ? true : undefined,
                // The measurement ghost's controls must not register with an ambient
                // roving navigation provider (see the ghost render below).
                isGhost: isGhost || undefined,
                stacked: isStacked,
              }}
            >
              {child}
            </ControlGroupContext.Provider>
          </div>
        );
      });

    // The trailing standalone slot: the built-in dismiss button (when `dismissible`) or
    // custom `actions` content. Both render in the same standalone wrapper and control
    // context so they fuse in a row, detach when the group wraps, and continue the
    // group's error/warning border styling.
    const renderDismissSlot = (isStacked: boolean, controlCount: number, isGhost: boolean) => {
      if (!dismissible && !hasCustomActions) {
        return null;
      }
      const position = getPosition(controlCount - 1, controlCount);
      return (
        <div
          className={clsx(
            styles.control,
            styles[`control-${position}`],
            // The built-in dismiss button detaches when the group wraps (a gap above it
            // and a right-aligned standalone button). A custom `actions` button instead
            // stays attached and fuses vertically, so it is NOT marked `control-standalone`
            // — it lays out like a normal stacked control (`control-actions`). The
            // validation text renders below the whole group (not between the controls and
            // this slot), so the button always fuses directly against the control above it.
            dismissible && styles['control-standalone'],
            hasCustomActions && styles['control-actions'],
            // In side mode (stacked) the actions slot sits beside the control column and
            // spans its full height instead of stacking below it.
            sideActions && isStacked && styles['control-actions-side'],
            testUtilStyles['control-group-item']
          )}
        >
          <ControlGroupContext.Provider
            value={{
              isInControlGroup: true,
              position,
              // `standaloneWhenStacked` drives the BUILT-IN dismiss button's dual-render
              // presentation (icon-only square in a row, text primary button when
              // stacked). `customStandalone` marks a CONSUMER `actions` button: it fuses
              // with the group in a row AND stays attached (fused vertically) when the
              // group wraps, while keeping its own border and background color.
              standaloneWhenStacked: dismissible ? true : undefined,
              customStandalone: dismissible ? undefined : true,
              // In side mode the button fuses on its leading (inline-start) edge like a
              // row control and spans the column height, rather than fusing on its top.
              sideActions: sideActions && isStacked ? true : undefined,
              isGhost: isGhost || undefined,
              stacked: isStacked,
              // The trailing slot has no validation state of its own; pass the
              // group's state so it paints its border (incl. the seam with the last
              // control) to continue the unit error/warning styling.
              invalid,
              warning,
            }}
          >
            {dismissible ? (
              /*
                One button renders both the close icon and the "Remove" text.
                CSS shows only the icon (square icon-button look) while the group
                is laid out in a row, and swaps to the text (primary button) when
                the group wraps. See `in-control-group-standalone` in button styles.
              */
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
            ) : (
              resolveActions(isStacked)
            )}
          </ControlGroupContext.Provider>
        </div>
      );
    };

    // The error / warning text renders inside the group, between the controls and the
    // trailing slot, ONLY when that slot detaches from the controls — i.e. the built-in
    // `dismissible` button, which becomes a separate standalone button when the group
    // wraps. A custom `actions` button stays attached to the controls (it fuses
    // vertically), so the validation text renders below the whole group instead (in the
    // hints block), matching the row layout.
    const showInlineValidation = stacked && dismissible;

    // Composes the controls, the (inline-only) validation messages, and the trailing
    // button for a given wrap state. The children are resolved for that same state, so a
    // `children` render function sees `wrap` matching this layout.
    const renderGroupContent = (isStacked: boolean, isGhost = false) => {
      const flattened = resolveChildren(isStacked);
      const controlCount = getControlCount(flattened);
      // Side layout (stacked): the control slots stack inside a column wrapper, and the
      // button slot is a sibling that stretches to the column's height. In a row (and in
      // the inline layout) the slots and button are flat siblings of `.group`, fused.
      if (sideActions && isStacked) {
        // The button is a separate column here, not part of the vertical stack, so the
        // control slots' first/middle/last positions are computed among the controls
        // ALONE (excluding the button). Otherwise the last real control would be `middle`
        // (the button would take `last`) and would not round its outer bottom corner.
        return (
          <>
            <div className={styles['controls-stack']}>
              {renderControlSlots(isStacked, flattened, flattened.length, isGhost)}
            </div>
            {renderDismissSlot(isStacked, controlCount, isGhost)}
          </>
        );
      }
      return (
        <>
          {renderControlSlots(isStacked, flattened, controlCount, isGhost)}
          {isStacked && dismissible && validationMessages && (
            <div className={styles['inline-hints']}>{validationMessages}</div>
          )}
          {renderDismissSlot(isStacked, controlCount, isGhost)}
        </>
      );
    };

    return (
      <div
        {...baseProps}
        ref={rootMeasureRef}
        className={clsx(baseProps.className, styles.root, stacked && styles.stacked, testUtilStyles['control-group'])}
      >
        {inlineLabelText && (
          <span id={inlineLabelId} className={clsx(styles['inline-label'], testUtilStyles['inline-label'])}>
            {inlineLabelText}
          </span>
        )}
        <div
          role="group"
          aria-label={ariaLabel}
          aria-labelledby={groupAriaLabelledby}
          aria-describedby={groupAriaDescribedby}
          className={clsx(
            styles.group,
            stacked && styles.stacked,
            sideActions && stacked && styles['group-actions-side'],
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
            {renderGroupContent(stacked)}
          </FormFieldContext.Provider>
        </div>

        {/*
          Hidden ghost row, used only to measure the width the controls need as a single
          row. It is always a row, `aria-hidden`, and out of flow, so its width is
          stable regardless of whether the visible group has stacked.
        */}
        <div ref={ghostRef} className={styles.ghost} aria-hidden="true">
          <div className={clsx(styles.group, invalid && styles.invalid, warning && styles.warning)}>
            {/*
              The ghost duplicates every control for width measurement. Its controls are
              rendered with `isGhost` so they do NOT register with an ambient roving
              navigation provider (for example a TreeView's) — otherwise the hidden
              duplicates would pollute that provider's focusable set and break arrow-key
              navigation between the real controls.
            */}
            {renderGroupContent(false, true)}
          </div>
        </div>

        {/*
          Below-group hints. The error / warning text renders here unless it is shown
          inline inside the group (only when the built-in dismiss button detaches on
          wrap — see `showInlineValidation`). With a custom `actions` button, which stays
          attached, the validation text renders below the button here, just like the row
          layout. The description always stays below the group.
        */}
        {((!showInlineValidation && validationMessages) || description) && (
          <div className={styles.hints}>
            {!showInlineValidation && validationMessages}
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
