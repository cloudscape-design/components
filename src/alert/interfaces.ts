// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export namespace AlertProps {
  export type Type = 'success' | 'error' | 'warning' | 'info';
}

export interface AlertProps extends BaseComponentProps {
  /**
   * Specifies the type of message you want to display.
   */
  type?: AlertProps.Type;
  /**
   * Determines whether the alert is displayed.
   * @deprecated Use conditional rendering in your code instead of this prop
   */
  visible?: boolean;
  /**
   * Adds a close button to the alert when set to `true`.
   * An `onDismiss` event is fired when a user clicks the button.
   */
  dismissible?: boolean;
  /**
   * Adds an aria-label to the dismiss button.
   */
  dismissAriaLabel?: string;
  /**
   * Primary text displayed in the element.
   */
  children?: React.ReactNode;
  /**
   * Heading text.
   */
  header?: React.ReactNode;
  /**
   * Displays an action button next to the message area when set.
   * An `onButtonClick` event is fired when the user clicks it.
   * **Deprecated**, replaced by `action`.
   */
  buttonText?: React.ReactNode;
  /**
   * Specifies an action for the alert message.
   * Although it is technically possible to insert any content, our UX guidelines only allow you to add a button.
   */
  action?: React.ReactNode;
  /**
   * Fired when the user clicks the close icon that is displayed
   * when the `dismissible` property is set to `true`.
   */
  onDismiss?: NonCancelableEventHandler;
  /**
   * Fired when the user clicks the action button.
   * **Deprecated**, replaced by `action`.
   */
  onButtonClick?: NonCancelableEventHandler;
}
