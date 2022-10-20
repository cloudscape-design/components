// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComponentsI18N } from './interfaces';
import React, { createContext, useContext, useMemo } from 'react';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

interface GlobalI18NContextProviderProps {
  children: React.ReactNode;
  messages: DeepPartial<ComponentsI18N>;
}

interface ComponentI18NContext {
  messages: GlobalI18NContextProviderProps['messages'];
}

const GlobalI18NContext = createContext<ComponentI18NContext>({
  messages: {},
});

/**
 * To be used like this:
 *
 * import messagesGerman from '@cloudscape-design/translations/de-DE';
 *
 * function MyApp() {
 *   return (
 *     <GlobalI18NContextProvider messages={messagesGerman}>
 *        <SpaceBetween>... application content ...</SpaceBetween>
 *     </GlobalI18NContextProvider>
 *   )
 * }
 *
 */
export function GlobalI18NContextProvider({ children, messages }: GlobalI18NContextProviderProps) {
  const value = useMemo(() => ({ messages }), [messages]);

  return <GlobalI18NContext.Provider value={value}>{children}</GlobalI18NContext.Provider>;
}

export function useI18NContext<ComponentName extends keyof ComponentsI18N>(
  componentName: ComponentName
): DeepPartial<ComponentsI18N[ComponentName]> {
  const i18nContext = useContext(GlobalI18NContext);

  return i18nContext.messages[componentName];
}
