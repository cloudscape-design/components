// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComponentsI18N } from './interfaces';
import React, { createContext } from 'react';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

interface GlobalI18NContextProviderProps {
  children: React.ReactNode;
  messages: DeepPartial<ComponentsI18N>;
}

interface ComponentI18NContextProviderProps<ComponentName extends keyof ComponentsI18N> {
  children: React.ReactNode;
  componentName: ComponentName;
  messages: DeepPartial<ComponentsI18N[ComponentName]>;
}

interface ComponentI18N<ComponentName extends keyof ComponentsI18N> {
  messages: ComponentsI18N[ComponentName];
}

function GlobalI18NContextProvider({ children }: GlobalI18NContextProviderProps) {}

function ComponentI18NContextProvider<ComponentName extends keyof ComponentsI18N>({
  componentName,
  children,
}: ComponentI18NContextProviderProps<ComponentName>) {}

function useI18NContext<ComponentName extends keyof ComponentsI18N>(): ComponentI18N<ComponentName> {}
