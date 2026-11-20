// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { isDevelopment, isTestEnvironment } from '../internal/is-development';
import { awsuiPluginsInternal } from '../internal/plugins/api';
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
  /**
   * Set while a provider is still loading its messages, so that missing strings
   * are not reported as a consumer error in the meantime.
   */
  pending?: boolean;
}

export const namespace = 'cloudscape-design-components';

const defaultContextValue: InternalI18nContextProps = {
  locale: null,
  format: <T>(_namespace: string, _component: string, _key: string, provided: T) => provided,
};

export const pendingContextValue: InternalI18nContextProps = { ...defaultContextValue, pending: true };

export const InternalI18nContext = awsuiPluginsInternal.sharedReactContexts.createContext<InternalI18nContextProps>(
  React,
  'InternalI18nContext'
);

/**
 * Public hook for third-party component libraries to read the locale of the
 * nearest I18nProvider, for example to format values with `Intl` APIs in the
 * same language as the strings resolved through `useCustomI18n`.
 *
 * Returns the provider's locale, lowercased, or `null` outside a provider.
 */
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
  const context = useContext(InternalI18nContext);
  const { format } = context ?? defaultContextValue;
  const formatFunction = <MessageKey extends StringKeyOf<NamespaceTypes[ComponentName]>, ValueType>(
    key: MessageKey,
    provided: ValueType,
    customHandler?: CustomHandler<ValueType, NamespaceTypes[ComponentName][MessageKey]>
  ) => {
    const result = format(namespace, componentName, key, provided, customHandler);
    if (isDevelopment) {
      if (result === undefined && !context?.pending && !isTestEnvironment()) {
        warnOnce(
          componentName,
          'Some built-in strings are missing. Wrap your application in <I18nProvider> or provide the i18n properties of this component. See https://cloudscape.design/get-started/for-developers/internationalization/'
        );
      }
    }
    return result;
  };
  return formatFunction;
}

export function useInternalI18n<ComponentName extends StringKeyOf<I18nFormatArgTypes>>(
  componentName: ComponentName
): ComponentFormatFunction<ComponentName> {
  return useCustomI18n<I18nFormatArgTypes, ComponentName>(namespace, componentName);
}
