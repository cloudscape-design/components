// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { createContext } from 'react';

import { ErrorBoundaryProps } from './interfaces';

interface ErrorBoundariesContextValue {
  customMessage?: ErrorBoundaryProps.CustomMessage;
  feedbackLink?: string;
  i18nStrings?: ErrorBoundaryProps.I18nStrings;
}

export const ErrorBoundariesContext = createContext<ErrorBoundariesContextValue & { errorBoundariesActive: boolean }>({
  errorBoundariesActive: false,
});

export function ErrorBoundariesProvider({
  children,
  active = true,
  value,
}: {
  children: React.ReactNode;
  active?: boolean;
  value?: ErrorBoundariesContextValue;
}) {
  return (
    <ErrorBoundariesContext.Provider value={{ ...value, errorBoundariesActive: active }}>
      {children}
    </ErrorBoundariesContext.Provider>
  );
}
