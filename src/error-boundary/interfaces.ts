// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface ErrorBoundaryProps {
  children: React.ReactNode;

  wrapper?: (content: React.ReactNode) => React.ReactNode;

  customMessage?: ErrorBoundaryProps.CustomMessage;

  feedbackLink?: string;

  i18nStrings?: ErrorBoundaryProps.I18nStrings;
}

export namespace ErrorBoundaryProps {
  export interface CustomMessage {
    image?: React.ReactNode;
    header?: React.ReactNode;
    description?: React.ReactNode;
    feedback?: React.ReactNode;
  }

  export interface I18nStrings {
    imageAltText?: string;
    messageHeader?: string;
    messageDescription?: string;
    messageFeedback?: string;
  }
}
