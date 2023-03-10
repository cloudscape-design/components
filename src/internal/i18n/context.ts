// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

export type LocaleMessages = Record<string, Record<string, (input?: Record<string, string>) => string>>;

const I18nContext = React.createContext<LocaleMessages | null>(null);
I18nContext.displayName = 'I18nContext';

export const I18nProvider = I18nContext.Provider;
export function useI18nContext() {
  return useContext(I18nContext);
}
