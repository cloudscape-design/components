// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type PropertyOverride = (...args: any[]) => Record<string, string>;
export type I18nPropertyOverrides = Record<string, Record<string, PropertyOverride> | undefined>;

export const i18nPropertyOverrides: I18nPropertyOverrides = {
  pagination: {
    'ariaLabels.pageLabel': (pageNumber: number) => ({ pageNumber: `${pageNumber}` }),
  },
  'property-filter': {
    'i18nStrings.enteredTextLabel': (text: string) => ({ text }),
    'i18nStrings.removeTokenButtonAriaLabel': token => ({
      token__operator: token.operator,
      token__propertyKey: token.propertyKey,
      token__value: token.value,
    }),
  },
};
