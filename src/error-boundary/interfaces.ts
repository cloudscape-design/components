// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ErrorInfo } from 'react';

export interface ErrorBoundaryProps {
  /**
   * Optional identifier for the error boundary instance.
   *
   * When provided, the identifier is included in the `onError` callback payload.
   * In the rendered output, the boundary wraps its content in a `<div>` with the
   * attribute `data-awsui-boundary-id={errorBoundaryId}` to support debugging.
   */
  errorBoundaryId?: string;

  /**
   * Callback invoked when an error is intercepted by the boundary.
   * Use this function to record, log, or report errors (for example, to telemetry or monitoring systems).
   *
   * The callback receives a `detail` object containing:
   * * `error` (Error): The thrown error instance.
   * * `errorInfo` (React.ErrorInfo): Additional metadata captured by React.
   * * `errorBoundaryId` (optional, string): The boundary identifier, if defined.
   */
  onError: (detail: ErrorBoundaryProps.OnErrorDetail) => void;

  /**
   * Controls how nested error boundaries behave.
   *
   * Several components—such as app layout, container, and modal include built-in
   * error boundaries. These boundaries activate automatically when they detect
   * an ancestor boundary, inheriting configuration from the closest one.
   *
   * When `suppressNested` is set to `true`, nested built-in or standalone
   * boundaries are disabled. In this mode, all errors originating from within
   * the boundary’s content are captured exclusively by this boundary.
   */
  suppressNested?: boolean;

  /**
   * Optional custom renderer for the fallback UI displayed when an error occurs.
   *
   * The function receives the default slots derived from i18n configuration:
   * * `header` (ReactNode): The fallback header text.
   * * `description` (ReactNode): The fallback description text.
   * * `action` (ReactNode): The fallback action element (a refresh button by default).
   *
   * Return a React node to fully override the default fallback presentation.
   */
  renderFallback?: (props: ErrorBoundaryProps.FallbackProps) => React.ReactNode;

  /**
   * Localized strings and components used in the fallback UI.
   *
   * * `headerText` (string): Header text displayed in the fallback view.
   * * `descriptionText` (string): Description text displayed in the fallback view. Supports embedding inline
   *   feedback actions by including `<Feedback>` pseudo-tags when `components.Feedback` is provided.
   * * `refreshActionText` (string): Text for the default refresh action button.
   * * `components.Feedback` (React.ComponentType<I18nFeedbackProps>): A component used to render
   *   inline feedback actions within the description text.
   *
   * @i18n
   */
  i18nStrings?: ErrorBoundaryProps.I18nStrings;

  /**
   * Child content rendered when no error has been captured.
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
