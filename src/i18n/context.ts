// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import { awsuiPluginsInternal } from '../internal/plugins/api';
import { I18nFormatArgTypes } from './messages-types';

export type CustomHandler<ReturnValue, FormatFnArgs> = (formatFn: (args: FormatFnArgs) => string) => ReturnValue;

export interface FormatFunction {
  (namespace: string, component: string, key: string, provided: string): string;
  (namespace: string, component: string, key: string, provided: string | undefined): string | undefined;
  <T, A = unknown>(namespace: string, component: string, key: string, provided: T, handler?: CustomHandler<T, A>): T;
}

interface InternalI18nContextProps {
  locale: string | null;
  format: FormatFunction;
}

export const namespace = 'cloudscape-design-components';

const defaultContextValue: InternalI18nContextProps = {
  locale: null,
  format: <T>(_namespace: string, _component: string, _key: string, provided: T) => provided,
};

export const InternalI18nContext = awsuiPluginsInternal.sharedReactContexts.createContext<InternalI18nContextProps>(
  React,
  'InternalI18nContext'
);

export function useLocale(): string | null {
  return (useContext(InternalI18nContext) ?? defaultContextValue).locale;
}

/**
 * Utility to get "keyof T" but exclude number or symbol types.
 * TypeScript allows those types because JS implicitly casts them to string.
 */
type StringKeyOf<T> = Extract<keyof T, string>;

export interface GenericI18nFormatArgTypes {
  [componentName: string]: {
    [messageKey: string]: Record<string, string | number> | never;
  };
}

export interface GenericI18nFormatFunction<
  NamespaceTypes = GenericI18nFormatArgTypes,
  ComponentName extends StringKeyOf<NamespaceTypes> = StringKeyOf<NamespaceTypes>,
> {
  <MessageKey extends StringKeyOf<NamespaceTypes[ComponentName]>>(
    key: MessageKey,
    provided: string,
    handler?: CustomHandler<string, NamespaceTypes[ComponentName][MessageKey]>
  ): string;
  <MessageKey extends StringKeyOf<NamespaceTypes[ComponentName]>>(
    key: MessageKey,
    provided: string | undefined,
    handler?: CustomHandler<string | undefined, NamespaceTypes[ComponentName][MessageKey]>
  ): string | undefined;
  <MessageKey extends StringKeyOf<NamespaceTypes[ComponentName]>, ReturnValue>(
    key: MessageKey,
    provided: ReturnValue,
    handler: NamespaceTypes[ComponentName][MessageKey] extends never
      ? never
      : CustomHandler<ReturnValue, NamespaceTypes[ComponentName][MessageKey]>
  ): ReturnValue;
}

export type I18nFormatFunction<
  NamespaceTypes = GenericI18nFormatArgTypes,
  ComponentName extends StringKeyOf<NamespaceTypes> = StringKeyOf<NamespaceTypes>,
> = GenericI18nFormatFunction<NamespaceTypes, ComponentName>;

export type ComponentFormatFunction<ComponentName extends StringKeyOf<I18nFormatArgTypes>> = I18nFormatFunction<
  I18nFormatArgTypes,
  ComponentName
>;

/**
 * Public hook for third-party component libraries to resolve translations
 * through I18nProvider under their own namespace.
 */
export function useCustomI18n<
  NamespaceTypes = GenericI18nFormatArgTypes,
  ComponentName extends StringKeyOf<NamespaceTypes> = StringKeyOf<NamespaceTypes>,
>(namespace: string, componentName: ComponentName): I18nFormatFunction<NamespaceTypes, ComponentName> {
  const { format } = useContext(InternalI18nContext) ?? defaultContextValue;
  const formatFunction = <MessageKey extends StringKeyOf<NamespaceTypes[ComponentName]>, ValueType>(
    key: MessageKey,
    provided: ValueType,
    customHandler?: CustomHandler<ValueType, NamespaceTypes[ComponentName][MessageKey]>
  ) => format(namespace, componentName, key, provided, customHandler);
  return formatFunction as I18nFormatFunction<NamespaceTypes, ComponentName>;
}

export function useInternalI18n<ComponentName extends StringKeyOf<I18nFormatArgTypes>>(
  componentName: ComponentName
): ComponentFormatFunction<ComponentName> {
  return useCustomI18n<I18nFormatArgTypes, ComponentName>(namespace, componentName);
}
