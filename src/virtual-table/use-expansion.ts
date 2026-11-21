// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useMemo, useState } from 'react';

import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { VirtualTableProps } from './interfaces';

// Controlled/uncontrolled expansion state for the R-EXPAND disclosure column. Root owns
// this state (design: Root, not the sub-components, owns grid state). Exposes a stable
// signature so the windowing layout only recomputes when the set of expanded ids actually
// changes, not on every parent render.
interface UseExpansionParams<T> {
  trackBy: (item: T) => string;
  expandedItems?: ReadonlyArray<string>;
  defaultExpandedItems?: ReadonlyArray<string>;
  onExpandChange?: NonCancelableEventHandler<VirtualTableProps.ExpandChangeDetail<T>>;
}

interface Expansion<T> {
  expandedIds: ReadonlySet<string>;
  expandedSignature: string;
  isExpanded: (id: string) => boolean;
  toggle: (item: T) => void;
  expand: (item: T) => void;
}

export function useExpansion<T>({
  trackBy,
  expandedItems,
  defaultExpandedItems,
  onExpandChange,
}: UseExpansionParams<T>): Expansion<T> {
  const controlled = expandedItems !== undefined;
  const [uncontrolled, setUncontrolled] = useState<ReadonlyArray<string>>(defaultExpandedItems ?? []);
  const current = controlled ? expandedItems! : uncontrolled;

  const expandedIds = useMemo(() => new Set(current), [current]);
  const expandedSignature = useMemo(() => [...current].sort().join('\u0000'), [current]);

  const isExpanded = useCallback((id: string) => expandedIds.has(id), [expandedIds]);

  const setExpanded = useCallback(
    (item: T, expanded: boolean) => {
      const id = trackBy(item);
      const next = new Set(current);
      if (expanded) {
        next.add(id);
      } else {
        next.delete(id);
      }
      const nextArray = [...next];
      if (!controlled) {
        setUncontrolled(nextArray);
      }
      fireNonCancelableEvent(onExpandChange, { item, expanded, expandedItems: nextArray });
    },
    [current, controlled, trackBy, onExpandChange]
  );

  const toggle = useCallback(
    (item: T) => setExpanded(item, !expandedIds.has(trackBy(item))),
    [setExpanded, expandedIds, trackBy]
  );

  const expand = useCallback((item: T) => setExpanded(item, true), [setExpanded]);

  return { expandedIds, expandedSignature, isExpanded, toggle, expand };
}
