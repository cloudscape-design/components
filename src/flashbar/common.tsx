// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBaseComponent from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useMemo, useRef } from 'react';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { useReducedMotion, useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { getBaseProps } from '../internal/base-component';
import { FlashbarProps } from './interfaces';

// Common logic for collapsible and non-collapsible Flashbar
export function useFlashbar({ items, ...restProps }: FlashbarProps) {
  const { __internalRootRef } = useBaseComponent('Flashbar');
  const allItemsHaveId = useMemo(() => items.every(item => 'id' in item), [items]);
  const baseProps = getBaseProps(restProps);
  const ref = useRef<HTMLDivElement | null>(null);
  const [breakpoint, breakpointRef] = useContainerBreakpoints(['xs']);
  const mergedRef = useMergeRefs(ref, breakpointRef, __internalRootRef);
  const isReducedMotion = useReducedMotion(breakpointRef as any);
  const isVisualRefresh = useVisualRefresh();

  return { allItemsHaveId, baseProps, breakpoint, isReducedMotion, isVisualRefresh, mergedRef, ref };
}
