// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useContext } from 'react';

export type CustomHandler<T> = (formatFn: (args: Record<string, string | number>) => string) => T;

export interface FormatFunction {
  (namespace: string, component: string, key: string, provided: string): string;
  (namespace: string, component: string, key: string, provided: string | undefined): string | undefined;
  <T>(namespace: string, component: string, key: string, provided: T, handler?: CustomHandler<T>): T;
}

function defaultFormatFunction<T>(_namespace: string, _component: string, _key: string, provided: T) {
  return provided;
}

export const InternalI18nContext = React.createContext<FormatFunction>(defaultFormatFunction);

export interface ComponentFormatFunction {
  (key: string, provided: string): string;
  (key: string, provided: string | undefined): string | undefined;
  <T>(key: string, provided: T, handler?: CustomHandler<T>): T;
}

export function useInternalI18n(componentName: string) {
  // HACK: useContext should return the default value if a provider
  // isn't present, but some consumers mock out React.useContext globally
  // in their tests, so we can't rely on this assumption.
  const format = useContext(InternalI18nContext) || defaultFormatFunction;
  return useCallback<ComponentFormatFunction>(
    <T>(key: string, provided: T, customHandler?: CustomHandler<T>) => {
      return format<T>('@cloudscape-design/components', componentName, key, provided, customHandler);
    },
    [format, componentName]
  );
}
