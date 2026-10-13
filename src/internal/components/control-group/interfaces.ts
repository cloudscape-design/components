// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonProps } from '../../../button/interfaces';
import { IconProps } from '../../../icon/interfaces';
import { BaseComponentProps } from '../../../types/base-component';
import { GroupedControlDirection } from '../../context/control-group-context';
import { CancelableEventHandler } from '../../events';

// `'auto'` exists only at the prop boundary; it resolves to a concrete
// GroupedControlDirection before reaching context, classes, or SCSS.
export type ControlGroupDirection = GroupedControlDirection | 'auto';

export interface ControlGroupProps extends BaseComponentProps {
  children?: React.ReactNode;
  /**
   * The axis along which the controls are laid out.
   * - `'auto'` (default): measures the available width and lays the controls out as a single
   *   row when they fit, stacking them vertically when they do not.
   * - `'horizontal'` / `'vertical'`: forces that axis and skips measurement.
   */
  direction?: ControlGroupDirection;
  inlineLabelText?: string;
  /**
   * Specifies an action button rendered next to the grouped controls.
   */
  actionButton?: ControlGroupProps.ActionButton;
}

export namespace ControlGroupProps {
  export interface ActionButton {
    /**
     * Called when the user clicks on the button and the button is not disabled.
     */
    onClick?: CancelableEventHandler<ButtonProps.ClickDetail>;

    /**
     * Renders the button as disabled and prevents clicks.
     */
    disabled?: boolean;

    /**
     * Provides a reason why the button is disabled (only when `disabled` is `true`).
     * If provided, the button becomes focusable.
     */
    disabledReason?: string;

    /**
     * Adds `aria-label` to the button element.
     * The text will also be added to the `title` attribute of the button.
     */
    ariaLabel: string;

    /**
     * Adds `aria-describedby` to the button.
     */
    ariaDescribedby?: string;

    /** Specifies the icon to display (for example `remove` or `close`). */
    iconName: IconProps.Name;
  }
}
