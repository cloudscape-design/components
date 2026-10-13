// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { InternalButton } from '../../../button/internal';
import { getBaseProps } from '../../base-component';
import { GroupedControlContext, GroupedControlPosition } from '../../context/control-group-context';
import { FormFieldContext, useFormFieldContext } from '../../context/form-field-context';
import customCssProps from '../../generated/custom-css-properties';
import { colorTextStatusError, colorTextStatusWarning } from '../../generated/styles/tokens';
import { flattenChildren } from '../../utils/flatten-children';
import { ControlGroupProps } from './interfaces';

import buttonStyles from '../../../button/styles.css.js';
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

  // The group owns the validation state read from the surrounding form field.
  // Error wins over warning, matching the precedence every individual control uses.
  const formFieldContext = useFormFieldContext({});
  const isInvalid = !!formFieldContext.invalid;
  const isWarning = !!formFieldContext.warning && !isInvalid;

  // Publish the validation color to every grouped control via an inherited custom
  // property set on the `.controls` box. Each control reads it on exactly its
  // outward-facing border edges (see the shared `grouped-control` mixin), so the
  // inner seams between controls stay neutral. The action button lives in a
  // sibling `.action-slot`, so it never inherits this property and is excluded.
  // Error wins over warning; when neutral the property is omitted entirely.
  const groupedControlBorderColor = isInvalid ? colorTextStatusError : isWarning ? colorTextStatusWarning : undefined;
  const controlsStyle = groupedControlBorderColor
    ? ({ [customCssProps.groupedControlBorderColor]: groupedControlBorderColor } as React.CSSProperties)
    : undefined;

  const flattenedChildren = flattenChildren(children, 'ControlGroup');
  const controlCount = flattenedChildren.length;

  const rootClassnames = [styles.root, baseProps.className, testUtilStyles.root];

  const controls = (
    <div
      {...(inlineLabelText ? { 'aria-labelledby': labelId } : actionButton ? {} : baseProps)}
      role="group"
      style={controlsStyle}
      className={clsx(
        styles.controls,
        styles[`controls-${direction}`],
        isInvalid && [styles['controls-invalid'], testUtilStyles['controls-invalid']],
        isWarning && [styles['controls-warning'], testUtilStyles['controls-warning']],
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
              value={{ position, direction, hasAction: !!actionButton, invalid: isInvalid, warning: isWarning }}
            >
              {/*
                Each grouped control paints the validation color on its own
                outward-facing border edges (driven by the inherited custom
                property above). Mask the form-field validation flags so inner
                controls do not ALSO react to the form field directly (which
                would color their inner seams); everything else (controlId, aria
                wiring) passes through unchanged.
              */}
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
      {/*
        Publish the validation color to the action slot so the action button
        inherits `--awsui-grouped-control-border-color`. The action button's
        `variant-control-group-action` style reads that property on exactly its
        inline-start (controls-facing) edge, coloring the single boundary line
        between the controls and the button. The property is only set here when
        the group is in a validation state (`controlsStyle` is otherwise
        undefined), so a neutral group falls back to the button's neutral variant
        border and no stray colored seam appears. The button's other edges stay
        neutral because the variant only reads the property on inline-start.
      */}
      <div style={controlsStyle} className={styles['action-slot']}>
        <InternalButton
          className={clsx(
            testUtilStyles['action-button'],
            // In a validation state, mark the action button so its SCSS applies
            // the extra-thick validation width on the controls-facing (inline-
            // start) seam — matching the standalone invalid/warning controls'
            // inline-start border width and keeping it through hover. The marker
            // is added only when the group is in a validation state (reusing the
            // `groupedControlBorderColor` signal, which is set for error/warning
            // and `undefined` when neutral), so neutral groups and non-action
            // buttons are untouched.
            groupedControlBorderColor && buttonStyles['action-button-validation']
          )}
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
