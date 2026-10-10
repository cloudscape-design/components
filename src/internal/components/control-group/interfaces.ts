// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonProps } from '../../../button/interfaces';
import { IconProps } from '../../../icon/interfaces';
import { BaseComponentProps } from '../../../types/base-component';
import { GroupedControlDirection } from '../../context/control-group-context';
import { CancelableEventHandler } from '../../events';

export interface ControlGroupProps extends BaseComponentProps {
  children?: React.ReactNode;
  direction?: GroupedControlDirection;
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
    ariaLabel?: string;

    /**
     * Adds `aria-describedby` to the button.
     */
    ariaDescribedby?: string;

    /** Specifies the icon to display (for example `remove` or `close`). */
    iconName?: IconProps.Name;
  }
}
