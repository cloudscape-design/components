// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ErrorContext } from '../internal/analytics/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export namespace AlertProps {
  export type Type = 'success' | 'error' | 'warning' | 'info';

  export interface Ref {
    /**
     * Sets focus on the alert content.
     */
    focus(): void;
  }

  export interface I18nStrings {
    /*
     * Specifies the ARIA label for the alert icon for type `success`.
     * @property {string} [successIconAriaLabel] - optional
     */
    successIconAriaLabel?: string;
    /*
     * Specifies the ARIA label for the alert icon for type `error`.
     * @property {string} [errorIconAriaLabel] - optional
     */
    errorIconAriaLabel?: string;
    /*
     * Specifies the ARIA label for the alert icon for type `warning`.
     * @property {string} [warningIconAriaLabel] - optional
     */
    warningIconAriaLabel?: string;
    /*
     * Specifies the ARIA label for the alert icon for type `info`.
     * @property {string} [infoIconAriaLabel] - optional
     */
    infoIconAriaLabel?: string;
    /*
     * Specifies the ARIA label for the dismiss button.
     * @property {string} [dismissAriaLabel] - optional
     */
    dismissAriaLabel?: string;
  }

  export interface AnalyticsMetadata {
    errorContext?: ErrorContext;
  }
}

export interface AlertProps extends BaseComponentProps {
  /**
   * Specifies the type of message you want to display.
   */
  type?: AlertProps.Type;

  /**
   * Provides a text alternative for the icon.
   *
   * @deprecated Use the label properties inside `i18nStrings` instead.
   * If the label is assigned via the `i18nStrings` property, this label will be ignored.
   */
  statusIconAriaLabel?: string;

  /**
   * Determines whether the alert is displayed.
   * @deprecated Use conditional rendering in your code instead of this prop.
   */
  visible?: boolean;
  /**
   * Adds a close button to the alert when set to `true`.
   * An `onDismiss` event is fired when a user clicks the button.
   */
  dismissible?: boolean;
  /**
   * Adds an aria-label to the dismiss button.
   * @i18n
   *
   * @deprecated Use `i18nStrings.dismissAriaLabel` instead.
   * If the label is assigned via the `i18nStrings` property, this label will be ignored.
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
   * @deprecated Replaced by `action`.
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
   * **Deprecated** Replaced by `action`.
   */
  onButtonClick?: NonCancelableEventHandler;
  /**
   * An object containing all the necessary localized strings required by the component.
   * @property {AlertProps.I18nStrings} [i18nStrings] - optional
   * @i18n
   */
  i18nStrings?: AlertProps.I18nStrings;
  /**
   * Specifies additional analytics-related metadata.
   * * `errorContext` - Error category and error sub-category specific metadata.
   * @analytics
   */
  analyticsMetadata?: AlertProps.AnalyticsMetadata;
}
