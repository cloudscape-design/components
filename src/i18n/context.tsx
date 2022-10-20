// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComponentsI18N } from './interfaces';
import React, { createContext, useContext, useMemo } from 'react';

interface I18NContextProviderProps {
  children: React.ReactNode;
  messages: {
    [namespace: string]: Record<string, any>;
  };
}

interface ComponentI18NContext {
  messages: {
    [namespace: string]: Record<string, any>;
  };
}

const I18NContext = createContext<ComponentI18NContext>({
  messages: {},
});

export function I18NContextProvider({ children, messages }: I18NContextProviderProps) {
  const value = useMemo(() => ({ messages }), [messages]);
  return <I18NContext.Provider value={value}>{children}</I18NContext.Provider>;
}

export function useI18NContext<ComponentName extends keyof ComponentsI18N>(
  componentName: ComponentName
): ComponentsI18N[ComponentName] {
  const i18nContext = useContext(I18NContext);
  return i18nContext.messages['@cloudscape-design/components'][componentName];
}
