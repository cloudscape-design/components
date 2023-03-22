// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

export type CustomHandler<T> = (formatFn: (args: Record<string, string | number>) => string) => T;

export interface FormatFunction {
  (namespace: string, component: string, key: string, provided: string): string;
  (namespace: string, component: string, key: string, provided: string | undefined): string | undefined;
  <T>(namespace: string, component: string, key: string, provided: T, handler?: CustomHandler<T>): T;
}

export const InternalI18nContext = React.createContext<FormatFunction>(
  <T>(_namespace: string, _component: string, _key: string, provided: T) => provided
);

export interface ComponentFormatFunction {
  (key: string, provided: string): string;
  (key: string, provided: string | undefined): string | undefined;
  <T>(key: string, provided: T, handler?: CustomHandler<T>): T;
}

export function useInternalI18n(componentName: string): ComponentFormatFunction {
  const format = useContext(InternalI18nContext);
  return <T>(key: string, provided: T, customHandler?: CustomHandler<T>) => {
    return format<T>('@cloudscape-design/components', componentName, key, provided, customHandler);
  };
}
