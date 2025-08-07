// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ButtonProps } from '../button/interfaces';
import { ErrorContext } from '../internal/analytics/interfaces';
import { BaseComponentProps } from '../internal/base-component';

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
    analyticsMetadata?: FlashbarProps.ItemAnalyticsMetadata;
  }

  export interface ItemAnalyticsMetadata {
    suppressFlowMetricEvents?: boolean;
    errorContext?: ErrorContext;
  }

  export interface I18nStrings {
    ariaLabel?: string;
    errorIconAriaLabel?: string;
    infoIconAriaLabel?: string;
    inProgressIconAriaLabel?: string;
    notificationBarAriaLabel?: string;
    notificationBarText?: string;
    successIconAriaLabel?: string;
    warningIconAriaLabel?: string;
  }

  export interface Style {
    item?: {
      root?: {
        background?: {
          error?: string;
          info?: string;
          inProgress?: string;
          success?: string;
          warning?: string;
        };
        borderColor?: {
          error?: string;
          info?: string;
          inProgress?: string;
          success?: string;
          warning?: string;
        };
        borderRadius?: string;
        borderWidth?: string;
        color?: {
          error?: string;
          info?: string;
          inProgress?: string;
          success?: string;
          warning?: string;
        };
        focusRing?: {
          borderColor?: {
            error?: string;
            info?: string;
            inProgress?: string;
            success?: string;
            warning?: string;
          };
          borderRadius?: string;
          borderWidth?: string;
        };
      };
      dismissButton?: {
        color?: {
          active?: {
            error?: string;
            info?: string;
            inProgress?: string;
            success?: string;
            warning?: string;
          };
          default?: {
            error?: string;
            info?: string;
            inProgress?: string;
            success?: string;
            warning?: string;
          };
          hover?: {
            error?: string;
            info?: string;
            inProgress?: string;
            success?: string;
            warning?: string;
          };
        };
        focusRing?: {
          borderColor?: {
            error?: string;
            info?: string;
            inProgress?: string;
            success?: string;
            warning?: string;
          };
          borderRadius?: string;
          borderWidth?: string;
        };
      };
    };
    notificationBar?: {
      root?: {
        background?: {
          active?: string;
          default?: string;
          hover?: string;
        };
        borderColor?: {
          active?: string;
          default?: string;
          hover?: string;
        };
        borderRadius?: string;
        borderWidth?: string;
        color?: {
          active?: string;
          default?: string;
          hover?: string;
        };
      };
      expandButton?: {
        focusRing?: {
          borderColor?: string;
          borderRadius?: string;
          borderWidth?: string;
        };
      };
    };
  }

  export type Type = 'success' | 'warning' | 'info' | 'error' | 'in-progress';
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
   * * `type` (string) - Indicates the type of the message to be displayed. Allowed values are as follows: `success, error, warning, info, in-progress`. The default is `info`.
   * * `loading` (boolean) - Replaces the status icon with a spinner and forces the type to `info`.
   * * `dismissible` (boolean) - Determines whether the component includes a close button icon. By default, the close button is not included.
   * When a user clicks on this button the `onDismiss` handler is called.
   * * `dismissLabel` (string) - Specifies an `aria-label` for to the dismiss icon button for improved accessibility.
   * * `statusIconAriaLabel` (string) - Specifies an `aria-label` for to the status icon for improved accessibility.
   * If not provided, `i18nStrings.{type}IconAriaLabel` will be used as a fallback.
   * * `ariaRole` (string) - For flash messages added after page load, specifies how this message is communicated to assistive
   * technology. Use "status" for status updates or informational content. Use "alert" for important messages that need the
   * user's attention.
   * * `action` (ReactNode) - Specifies an action for the flash message. Although it is technically possible to insert any content,
   * our UX guidelines only allow you to add a button.
   * * `buttonText` (string) - Specifies that an action button should be displayed, with the specified text.
   * When a user clicks on this button the `onButtonClick` handler is called.
   * If the `action` property is set, this property is ignored. **Deprecated**, replaced by `action`.
   * * `onButtonClick` (event => void) - Called when a user clicks on the action button. This is not called if you create a custom button
   *   using the `action` property. **Deprecated**, replaced by `action`.
   * * `onDismiss` (event => void) - (Optional) Called when a user clicks on the dismiss button.
   * * `id` (string) - Specifies a unique flash message identifier. This property is used in two ways:
   *   1. As a [keys](https://reactjs.org/docs/lists-and-keys.html#keys) source for React rendering.
   *   2. To identify which flash message will be removed from the DOM when it is dismissed, to animate it out.
   * * `analyticsMetadata` (FlashbarProps.ItemAnalyticsMetadata) - (Optional) Specifies additional analytics-related metadata.
   *   * `suppressFlowMetricEvents` - Prevent this item from generating events related to flow metrics.
   * @analytics
   */
  items: ReadonlyArray<FlashbarProps.MessageDefinition>;

  /**
   * Specifies whether flash messages should be stacked.
   */
  stackItems?: boolean;

  /**
   * An object containing all the necessary localized strings required by the component. The object should contain:
   *
   * * `ariaLabel` - Specifies the ARIA label for the list of notifications.
   *
   * If `stackItems` is set to `true`, it should also contain:
   *
   * * `notificationBarAriaLabel` - (optional) Specifies the ARIA label for the notification bar
   * * `notificationBarText` - (optional) Specifies the text shown in the notification bar
   * * `errorIconAriaLabel` - (optional) Specifies the ARIA label for the icon displayed next to the number of items of type `error`.
   * * `warningIconAriaLabel` - (optional) Specifies the ARIA label for the icon displayed next to the number of items of type `warning`.
   * * `infoIconAriaLabel` - (optional) Specifies the ARIA label for the icon displayed next to the number of items of type `info`.
   * * `successIconAriaLabel` - (optional) Specifies the ARIA label for the icon displayed next to the number of items of type `success`.
   * * `inProgressIconAriaLabel` - (optional) Specifies the ARIA label for the icon displayed next to the number of items of type `in-progress` or with `loading` set to `true`.
   * @i18n
   */
  i18nStrings?: FlashbarProps.I18nStrings;

  /**
   * Specifies an object of selectors and properties that are used to apply custom styles.
   *
   * - `item.root.background` {error, info, inProgress, success, warning} - (Optional) Background for item types.
   * - `item.root.borderColor` {error, info, inProgress, success, warning} - (Optional) Border color for item types.
   * - `item.root.borderRadius` (string) - (Optional) Item border radius.
   * - `item.root.borderWidth` (string) - (Optional) Item border width.
   * - `item.root.color` {error, info, inProgress, success, warning} - (Optional) Color for item types.
   * - `item.root.focusRing.borderColor` {error, info, inProgress, success, warning} - (Optional) Item focus ring border color.
   * - `item.root.focusRing.borderRadius` (string) - (Optional) Item focus ring border radius.
   * - `item.root.focusRing.borderWidth` (string) - (Optional) Item focus ring border width.
   * - `item.dismissButton.color.active` {error, info, inProgress, success, warning} - (Optional) Color for dismiss button active state.
   * - `item.dismissButton.color.default` {error, info, inProgress, success, warning} - (Optional) Color for dismiss button default state.
   * - `item.dismissButton.color.hover` {error, info, inProgress, success, warning} - (Optional) Color for dismiss button hover state.
   * - `item.dismissButton.focusRing.borderColor` {error, info, inProgress, success, warning} - (Optional) Dismiss button focus ring border color.
   * - `item.dismissButton.focusRing.borderRadius` (string) - (Optional) Dismiss button focus ring border radius.
   * - `item.dismissButton.focusRing.borderWidth` (string) - (Optional) Dismiss button focus ring border width.
   * - `notificationBar.root.background` {active, default, hover} - (Optional) Background for notification bar states.
   * - `notificationBar.root.borderColor` {active, default, hover} - (Optional) Border color for notification bar states.
   * - `notificationBar.root.borderRadius` (string) - (Optional) Notification bar border radius.
   * - `notificationBar.root.borderWidth` (string) - (Optional) Notification bar border width.
   * - `notificationBar.root.color` {active, default, hover} - (Optional) Color for notification bar states.
   * - `notificationBar.expandButton.focusRing.borderColor` (string) - (Optional) Border color for the expand button.
   * - `notificationBar.expandButton.focusRing.borderRadius` (string) - (Optional) Border radius for the expand button.
   * - `notificationBar.expandButton.focusRing.borderWidth` (string) - (Optional) Border width for the expand button.
   * @awsuiSystem core
   */
  style?: FlashbarProps.Style;
}
