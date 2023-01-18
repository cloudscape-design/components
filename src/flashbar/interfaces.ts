// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import React from 'react';
import { ButtonProps } from '../button/interfaces';

export namespace FlashbarProps {
  export interface MessageDefinition {
    header?: React.ReactNode;
    content?: React.ReactNode;
    dismissible?: boolean;
    dismissLabel?: string;
    statusIconAriaLabel?: string;
    loading?: boolean;
    type?: FlashbarProps.Type;
    ariaRole?: FlashbarProps.AriaRole;
    action?: React.ReactNode;
    id?: string;
    buttonText?: ButtonProps['children'];
    onButtonClick?: ButtonProps['onClick'];
    onDismiss?: ButtonProps['onClick'];
  }

  export type Type = 'success' | 'warning' | 'info' | 'error';
  export type AriaRole = 'alert' | 'status';
}

export interface FlashbarProps extends BaseComponentProps {
  /**
   * Specifies flash messages that appear in the same order that they are listed.
   * The value is an array of flash message definition objects.
   *
   * A flash message object contains the following properties:
   * * `header` (ReactNode) - Specifies the heading text.
   * * `content` (ReactNode) - Specifies the primary text displayed in the flash element.
   * * `type` (string) - Indicates the type of the message to be displayed. Allowed values are as follows: `success, error, warning, info`. The default is `info`.
   * * `loading` (boolean) - Replaces the status icon with a spinner and forces the type to `info`.
   * * `dismissible` (boolean) - Determines whether the component includes a close button icon. By default, the close button is not included.
   * When a user clicks on this button the `onDismiss` handler is called.
   * * `dismissLabel` (string) - Specifies an `aria-label` for to the dismiss icon button for improved accessibility.
   * * `statusIconAriaLabel` (string) - Specifies an `aria-label` for to the status icon for improved accessibility.
   * * `ariaRole` (boolean) - For flash messages added after page load, specifies how this message is communicated to assistive
   * technology. Use "status" for status updates or informational content. Use "alert" for important messages that need the
   * user's attention.
   * * `action` (ReactNode) - Specifies an action for the flash message. Although it is technically possible to insert any content,
   * our UX guidelines only allow you to add a button.
   * * `buttonText` (string) - Specifies that an action button should be displayed, with the specified text.
   * When a user clicks on this button the `onButtonClick` handler is called. If the `action` property is set, this property is ignored.
   * **Deprecated**, replaced by `action`.
   * * `onButtonClick` (event => void) - Called when a user clicks on the action button. This is not called if you create a custom button
   *   using the `action` property. **Deprecated**, replaced by `action`.
   * * `id` (string) - Specifies a unique flash message identifier. This property  is used in two ways:
   *   1. As a [keys](https://reactjs.org/docs/lists-and-keys.html#keys) source for React rendering.
   *   2. To identify which flash message will be removed from the DOM when it is dismissed, to animate it out.
   * @visualrefresh `id` property
   */
  items: ReadonlyArray<FlashbarProps.MessageDefinition>;
}

export type FlashType = FlashbarProps.Type | 'progress';

export interface StackedFlashbarProps extends FlashbarProps {
  excludeTypes?: [FlashType];
  collapsible: boolean;
  i18nStrings?: StackedFlashbarProps.I18nStrings;
  excludeEmptyCounts?: boolean;
}

export namespace StackedFlashbarProps {
  export interface I18nStrings {
    ariaLabel: string;
    toggleButtonAriaLabel: string;
    toggleButtonText: string;
    errorCountAriaLabel?: string;
    warningCountAriaLabel?: string;
    successCountAriaLabel?: string;
    infoCountAriaLabel?: string;
    inProgressCountAriaLabel?: string;
  }
}
