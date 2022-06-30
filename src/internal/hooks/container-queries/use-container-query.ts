// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState, useCallback } from 'react';
import { ContainerQueryEntry } from './interfaces';
import { useResizeObserver } from './use-resize-observer';

/**
 * Attaches resize-observer to the referenced element and keeps last observation in state.
 * The hook allows to limit the amount of re-renders to only when the observed value changes.
 *
 * Examples:
 *    // Switching display mode under a given condition (only re-renders when mode changes):
 *    const [smallMode, ref] = useContainerQuery(entry => entry.contentBoxHeight <= smallModeHeight, [smallModeHeight]);
 *
 *    // Obtain observer entity (re-renders with each observation):
 *    const [entry, ref] = useContainerQuery(entry => entry);
 *
 *    // Using prevState to avoid unnecessary re-renders:
 *    const [value, ref] = useContainerQuery((entry, prevValue) => shouldUpdate(entry) ? getValue(entry) : prevValue);
 *
 * @param mapFn Function to convert ContainerQueryEntry to a custom type S
 * @param deps Dependency list to indicate when the mapFn changes
 * @returns A tuple of observation value and a reference to be attached to the target element.
 */
export function useContainerQuery<S>(
  mapFn: (entry: ContainerQueryEntry, prev: null | S) => S,
  deps: React.DependencyList = []
): [null | S, React.Ref<any>] {
  const elementRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<S | null>(null);

  // Update getElement when deps change to trigger new observation.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getElement = useCallback(() => elementRef.current, deps);

  useResizeObserver(getElement, entry => setState(prevState => mapFn(entry, prevState)));

  return [state, elementRef];
}
