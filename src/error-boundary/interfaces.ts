// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ErrorInfo } from 'react';

import { ButtonProps } from '../button/interfaces';
import { CancelableEventHandler } from '../internal/events';

export interface ErrorBoundaryProps {
  /**
   * This function is invoked when an error is captured. Use it to report errors for telemetry.
   *
   * Some components including app layout, container, modal, and more have built-in error boundaries.
   * The built-in error boundaries activate when wrapped with an error boundary component with a non-null `onError` callback.
   * They will use the props (`fallback`, `feedback`, `i18nStrings`, `onError`) of the closest error boundary up in the hierarchy.
   *
   * When the value is set to `null`, the error boundary and the nested built-in error boundaries are suppressed, so the error
   * passes through to the first non-suppressed error boundary up in the hierarchy.
   */
  onError: null | ((error: Error, info: ErrorInfo) => void);

  /**
   * This function is invoked when an error is captured. Use it to override the default fallback message parts:
   * * `header` (slot) - fallback message header.
   * * `description` (slot) - fallback message description.
   * * `action` (slot) - fallback message action.
   */
  fallback?: () => ErrorBoundaryProps.FallbackProps;

  /**
   * Fallback message feedback properties. The feedback properties are not applicable
   * if the custom fallback description is used.
   *
   * Supported properties:
   * * `href` - external navigation link to the feedback form. Cannot be used together with `onClick`.
   * * `onClick` - click handler for the feedback action. Cannot be used together with `href`.
   */
  feedback?: ErrorBoundaryProps.FeedbackProps;

  /**
   * An object containing all the localized strings required by the component:
   * * `headerText` (string): The text of the fallback message header.
   * * `descriptionText` (function): A function to return the text of the fallback message description. It takes optional feedback action text,
   *                                 which requires the `feedback` property to be defined.
   * * `feedbackActionText` (string): The text of the feedback action button.
   * * `refreshActionText` (string): The text of the refresh action button.
   * @i18n
   */
  i18nStrings?: ErrorBoundaryProps.I18nStrings;

  /**
   * Content rendered by default.
   */
  children: React.ReactNode;
}

export namespace ErrorBoundaryProps {
  export interface FallbackProps {
    header?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
  }

  export interface FeedbackProps {
    href?: string;
    onClick?: CancelableEventHandler<ButtonProps.ClickDetail>;
  }

  export interface I18nStrings {
    headerText?: string;
    descriptionText?: (feedbackAction: undefined | string) => string;
    feedbackActionText?: string;
    refreshActionText?: string;
  }
}
