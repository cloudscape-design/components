// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonProps } from '../button/interfaces';
import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../types/base-component';
import { CancelableEventHandler } from '../types/events';
import { FormFieldControlProps } from '../types/form-field';

export interface ControlGroupProps extends BaseComponentProps, FormFieldControlProps {
  children?: React.ReactNode;
  /**
   * The axis along which the controls are laid out (`horizontal`, `vertical` or `auto`).
   * When set to `auto` (default), the component decides the direction based on whether it
   * fits in the padding box of its
   * [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/Containing_block).
   */
  direction?: ControlGroupProps.ControlGroupDirection;
  inlineLabelText?: string;
  /**
   * Specifies an action button rendered next to the grouped controls.
   */
  actionButton?: ControlGroupProps.ActionButton;
}

export namespace ControlGroupProps {
  // `'auto'` exists only for the control group but not for the inner grouped controls,
  // which receive a definite value (`horizontal` or `vertical`).
  export type ControlGroupDirection = 'horizontal' | 'vertical' | 'auto';

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
