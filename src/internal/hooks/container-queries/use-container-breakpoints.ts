// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Breakpoint, getMatchingBreakpoint } from '../../breakpoints';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';

/**
 * Re-renders the component when the breakpoint for the component changes. Scopes the re-renders to the specific
 * breakpoints you want to break at. "default" is always included as a fallback, so ["xs"] would trigger for
 * "default" and "xs".
 *
 * @param triggers The relevant breakpoints to trigger for.
 */
export function useContainerBreakpoints<T extends readonly Breakpoint[], E extends Element = any>(triggers?: T) {
  // triggers.join() gives us a stable value to use for the dependencies argument
  const triggersDep = triggers?.join();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useContainerQuery(rect => getMatchingBreakpoint(rect.contentBoxWidth, triggers), [triggersDep]) as [
    'default' | T[number] | null,
    React.Ref<E>
  ];
}
