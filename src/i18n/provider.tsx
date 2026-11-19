// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { LocalI18nProvider } from './providers/local-provider';
import { I18nMessages } from './utils/i18n-formatter';

export interface I18nProviderProps {
  locale?: string;
  messages: ReadonlyArray<I18nMessages>;
  children: React.ReactNode;
}

export namespace I18nProviderProps {
  export type Messages = I18nMessages;
}

export function I18nProvider({ locale, messages, children }: I18nProviderProps) {
  useBaseComponent('I18nProvider');

  return (
    <LocalI18nProvider locale={locale} messages={messages}>
      {children}
    </LocalI18nProvider>
  );
}

applyDisplayName(I18nProvider, 'I18nProvider');
