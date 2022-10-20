// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComponentsI18N } from './interfaces';
import React, { createContext, useContext } from 'react';

import messagesPropertyFilterDefault from './messages/default/property-filter';
import messagesPropertyFilterGerman from './messages/de-DE/property-filter';

export const messagesPropertyFilter: {
  default: ComponentsI18N['property-filter'];
  'de-DE': ComponentsI18N['property-filter'];
} = { default: messagesPropertyFilterDefault, ['de-DE']: messagesPropertyFilterGerman };

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

interface GlobalI18NContextProviderProps {
  children: React.ReactNode;
  locale: 'default' | 'de-DE';
  messages?: DeepPartial<ComponentsI18N>;
}

interface ComponentI18NContext {
  locale: 'default' | 'de-DE';
}

// interface ComponentI18NContextProviderProps<ComponentName extends keyof ComponentsI18N> {
//   children: React.ReactNode;
//   componentName: ComponentName;
//   messages: DeepPartial<ComponentsI18N[ComponentName]>;
// }

const supportedLocales = ['default', 'de-DE'];
const browserLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
const defaultLocale = supportedLocales.indexOf(browserLocale) !== -1 ? browserLocale : 'default';

const GlobalI18NContext = createContext<ComponentI18NContext>({
  locale: defaultLocale as any,
});

export function GlobalI18NContextProvider({ children, locale }: GlobalI18NContextProviderProps) {
  return <GlobalI18NContext.Provider value={{ locale }}>{children}</GlobalI18NContext.Provider>;
}

// export function ComponentI18NContextProvider<ComponentName extends keyof ComponentsI18N>({
//   componentName,
//   children,
// }: ComponentI18NContextProviderProps<ComponentName>) {}

export function useI18NContext<ComponentName extends keyof ComponentsI18N>({
  componentName,
}: {
  componentName: ComponentName;
}): ComponentsI18N[ComponentName] {
  const i18nContext = useContext(GlobalI18NContext);

  if (componentName !== 'property-filter') {
    throw new Error(`I18n is not implemented for component "${componentName}"`);
  }

  return messagesPropertyFilter[i18nContext.locale] as any;
}
