// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ErrorInfo } from 'react';

export interface ErrorBoundaryProps {
  /**
   * Optional error boundary identifier that is passed as detail to the `onError` callback.
   * The content passed to the error boundary is wrapped in a div with `data-awsui-boundary-id={errorBoundaryId}`.
   */
  errorBoundaryId?: string;

  /**
   * This function is invoked when an error is captured. Use it to report errors for telemetry.
   * The detail include:
   * * `error` (Error) - the error object.
   * * `errorInfo` (React.ErrorInfo) - additional error meta-information from React.
   * * `errorBoundaryId` (optional, string) - the `errorBoundaryId` if defined.
   */
  onError: (detail: ErrorBoundaryProps.OnErrorDetail) => void;

  /**
   * Some components including app layout, container, modal, and more have built-in error boundaries.
   * They activate when there is an error boundary component up in the hierarchy. When active, they will
   * use the configuration of the closest error boundary up in the hierarchy.
   *
   * The nested error boundaries, built-in and standalone can be deactivated by using `suppressNested=true`. In that
   * case, any error originating from the error boundary content will be captured by this error boundary.
   */
  suppressNested?: boolean;

  /**
   * Custom render function for the fallback message. It takes the default i18n slots as input, including:
   * * `header` (ReactNode) - the fallback header taken from the definition or i18n.
   * * `description` (ReactNode) - the fallback description taken from the definition or i18n.
   * * `action` (ReactNode) - the fallback action taken from the definition or default refresh action.
   */
  renderFallback?: (props: ErrorBoundaryProps.FallbackProps) => React.ReactNode;

  /**
   * An object containing all the localized strings required by the component:
   * * `headerText` (string): The text of the fallback message header.
   * * `descriptionText` (string): The text of the fallback message description. You can inject inline feedback action
   * here by providing `components.Feedback`, and using <Feedback>custom text</Feedback> pseudo-tag in the text.
   * * `refreshActionText` (string): The text of the default refresh action button.
   * * `components.Feedback` (React.ComponentType<I18nFeedbackProps>): The inline action to be injected into the description text.
   * @i18n
   */
  i18nStrings?: ErrorBoundaryProps.I18nStrings;

  /**
   * Content rendered when no error is captured.
   */
  children: React.ReactNode;
}

export namespace ErrorBoundaryProps {
  export interface FallbackProps {
    header?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
  }

  export interface I18nStrings {
    headerText?: string;
    descriptionText?: string;
    refreshActionText?: string;
    components?: {
      Feedback?: React.ComponentType<I18nFeedbackProps>;
    };
  }

  export interface I18nFeedbackProps {
    children: React.ReactNode;
  }

  export interface OnErrorDetail {
    error: Error;
    errorInfo: ErrorInfo;
    errorBoundaryId?: string;
  }
}
