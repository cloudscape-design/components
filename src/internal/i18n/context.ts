// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

export type FormatFunction = <T>(component: string, key: string, provided: T) => T;
export const InternalI18nContext = React.createContext<FormatFunction>((_component, _key, provided) => provided);

export function useI18n() {
  return useContext(InternalI18nContext);
}
