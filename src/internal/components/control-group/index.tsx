// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { InternalButton } from '../../../button/internal';
import { IconProps } from '../../../icon/interfaces';
import { BaseComponentProps } from '../../../types/base-component';
import { getBaseProps } from '../../base-component';
import {
  GroupedControlContext,
  GroupedControlDirection,
  GroupedControlPosition,
} from '../../context/control-group-context';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../../events';
import { flattenChildren } from '../../utils/flatten-children';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export interface InternalControlGroupProps extends BaseComponentProps {
  children?: React.ReactNode;
  direction?: GroupedControlDirection;
  inlineLabelText?: string;
  /**
   * Specifies an action button rendered next to the grouped controls.
   */
  actionButton?: InternalControlGroupProps.ActionButton;
}

export namespace InternalControlGroupProps {
  export interface ActionButton {
    /** Called when the user clicks the button. */
    onClick?: NonCancelableEventHandler;
    /** Accessible name for the action. */
    ariaLabel?: string;
    /** Displays an icon in the action (for example `remove` or `close`). */
    iconName?: IconProps.Name;
    /** Alternate text for a custom icon, recommended for accessibility. */
    iconAlt?: string;
    /** Disables the action and prevents clicks. */
    disabled?: boolean;
    /** Reason the action is disabled (keeps it focusable). */
    disabledReason?: string;
    /** Adds `aria-describedby` to point the action at extra descriptive text. */
    ariaDescribedby?: string;
  }
}

export default function InternalControlGroup({
  children,
  direction = 'horizontal',
  inlineLabelText,
  actionButton,
  ...props
}: InternalControlGroupProps) {
  const baseProps = getBaseProps(props);
  const labelId = useUniqueId('control-group-label');

  const flattenedChildren = flattenChildren(children, 'ControlGroup');
  const controlCount = flattenedChildren.length;

  // The `role="group"` element wrapping the control slots. When an inline label is
  // present it is labelled by the label; otherwise it carries the component root props.
  const controls = (
    <div
      {...(inlineLabelText ? { 'aria-labelledby': labelId } : actionButton ? {} : baseProps)}
      role="group"
      className={clsx(
        inlineLabelText || actionButton ? undefined : baseProps.className,
        styles.root,
        styles[`root-${direction}`]
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

  // The controls, plus the fused action button when present. The action fuses as the
  // trailing element and owns its own border/corners. Its direction is always
  // `horizontal` (in a vertical group it sits beside the column, spanning its height):
  // flat inline-start corners, rounded inline-end. `hasAction` is omitted so it rounds
  // its inline-end. Not a control, not in the role="group".
  const controlsWithAction = actionButton ? (
    <div
      {...(inlineLabelText ? {} : baseProps)}
      className={clsx(inlineLabelText ? undefined : baseProps.className, styles.layout, styles[`layout-${direction}`])}
    >
      {controls}
      <div className={styles['action-slot']}>
        <GroupedControlContext.Provider value={{ position: 'last', direction: 'horizontal' }}>
          <InternalButton
            className={testUtilStyles['action-button']}
            variant="icon"
            iconName={actionButton.iconName}
            iconAlt={actionButton.iconAlt}
            ariaLabel={actionButton.ariaLabel}
            disabled={actionButton.disabled}
            disabledReason={actionButton.disabledReason}
            ariaDescribedby={actionButton.ariaDescribedby}
            onClick={() => fireNonCancelableEvent(actionButton.onClick)}
          />
        </GroupedControlContext.Provider>
      </div>
    </div>
  ) : (
    controls
  );

  if (inlineLabelText) {
    return (
      <div {...baseProps} className={clsx(baseProps.className, styles['inline-label-wrapper'])}>
        <label id={labelId} className={clsx(styles['inline-label'], testUtilStyles['inline-label'])}>
          {inlineLabelText}
        </label>
        <div className={styles['inline-label-trigger-wrapper']}>{controlsWithAction}</div>
      </div>
    );
  }

  return controlsWithAction;
}
