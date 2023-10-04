// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';
import { I18nFormatArgTypes } from './messages-types';

export type CustomHandler<ReturnValue, FormatFnArgs> = (formatFn: (args: FormatFnArgs) => string) => ReturnValue;

export interface FormatFunction {
  (namespace: string, component: string, key: string, provided: string): string;
  (namespace: string, component: string, key: string, provided: string | undefined): string | undefined;
  <T, A = unknown>(namespace: string, component: string, key: string, provided: T, handler?: CustomHandler<T, A>): T;
}

export interface InternalI18nContextProps {
  locale: string | null;
  format: FormatFunction;
}

export const InternalI18nContext = React.createContext<InternalI18nContextProps>({
  locale: null,
  format: <T>(_namespace: string, _component: string, _key: string, provided: T) => provided,
});

export function useLocale(): string | null {
  return useContext(InternalI18nContext).locale;
}

/**
 * Utility to get "keyof T" but exclude number or symbol types.
 * TypeScript allows those types because JS implicitly casts them to string.
 */
type StringKeyOf<T> = Extract<keyof T, string>;

export interface ComponentFormatFunction<ComponentName extends StringKeyOf<I18nFormatArgTypes>> {
  <MessageKey extends StringKeyOf<I18nFormatArgTypes[ComponentName]>>(
    key: MessageKey,
    provided: string,
    handler?: CustomHandler<string, I18nFormatArgTypes[ComponentName][MessageKey]>
  ): string;
  <MessageKey extends StringKeyOf<I18nFormatArgTypes[ComponentName]>>(
    key: MessageKey,
    provided: string | undefined,
    handler?: CustomHandler<string, I18nFormatArgTypes[ComponentName][MessageKey]>
  ): string | undefined;
  <MessageKey extends StringKeyOf<I18nFormatArgTypes[ComponentName]>, ReturnValue>(
    key: MessageKey,
    provided: ReturnValue,
    handler: I18nFormatArgTypes[ComponentName][MessageKey] extends never
      ? never
      : CustomHandler<ReturnValue, I18nFormatArgTypes[ComponentName][MessageKey]>
  ): ReturnValue;
}

export function useInternalI18n<ComponentName extends StringKeyOf<I18nFormatArgTypes>>(
  componentName: ComponentName
): ComponentFormatFunction<ComponentName> {
  const { format } = useContext(InternalI18nContext);
  return <MessageKey extends StringKeyOf<I18nFormatArgTypes[ComponentName]>, ValueType>(
    key: MessageKey,
    provided: ValueType,
    customHandler?: CustomHandler<ValueType, I18nFormatArgTypes[ComponentName][MessageKey]>
  ) => {
    return format('@cloudscape-design/components', componentName, key, provided, customHandler);
  };
}
