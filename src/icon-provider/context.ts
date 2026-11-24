// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useMemo } from 'react';

import generatedIcons from '../icon/generated/icons';
import { awsuiPluginsInternal } from '../internal/plugins/api';
import { IconProviderProps } from './interfaces';

// Shared contexts are keyed by the React object, but the same React can reach Cloudscape copies as different objects:
// the default export here, and the module namespace (`import * as React`) that the app layout widget gets from its
// loader. The namespace carries the default export as `default`, so both copies resolve to the same object.
const SharedReact = ((React as { default?: typeof React }).default ?? React) as typeof React;

/**
 * Shared between all Cloudscape copies on the page (e.g. the console-hosted app layout widgets), so that an
 * `IconProvider` from one copy reaches components rendered by another. Shared contexts have no default value,
 * so this only holds the overrides; consumers merge them over their own built-in icons (see `useIcons`).
 */
export const InternalIconContext = awsuiPluginsInternal.sharedReactContexts.createContext<IconProviderProps.Icons>(
  SharedReact,
  'IconProviderIconsContext'
);

/** Holds per-component custom icons. Empty by default: components render their built-in icons. */
export const InternalComponentIconsContext =
  awsuiPluginsInternal.sharedReactContexts.createContext<IconProviderProps.ComponentIcons>(
    SharedReact,
    'IconProviderComponentIconsContext'
  );

export function useIcons(): IconProviderProps.Icons {
  const overrides = useContext(InternalIconContext);
  return useMemo(() => (overrides ? { ...generatedIcons, ...overrides } : generatedIcons), [overrides]);
}
