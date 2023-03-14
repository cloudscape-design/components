// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

export type CustomHandler<T> = (formatFn: (args: Record<string, string | number>) => string) => T;

export interface FormatFunction {
  (component: string, key: string, provided: string): string;
  (component: string, key: string, provided: string | undefined): string | undefined;
  <T>(component: string, key: string, provided: T, handler: CustomHandler<T>): T;
}

export const InternalI18nContext = React.createContext<FormatFunction>(
  <T>(_component: string, _key: string, provided: T) => provided
);

export function useInternalI18n() {
  return useContext(InternalI18nContext);
}
