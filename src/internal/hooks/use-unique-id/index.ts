// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

let counter = 0;
const useIdFallback = () => {
  const idRef = useRef<string | null>(null);
  if (!idRef.current) {
    idRef.current = `${counter++}-${Date.now()}-${Math.round(Math.random() * 10000)}`;
  }
  return idRef.current;
};

const useId: typeof useIdFallback = (React as any).useId ?? useIdFallback;

export function useUniqueId(prefix?: string) {
  return `${prefix ? prefix : ''}` + useId();
}

const componentIndexes: Record<string, number> = {};
export const useUniqueIndex = (prefix: string) => {
  const ref = useRef<number>();

  useEffect(() => {
    if (!componentIndexes[prefix]) {
      componentIndexes[prefix] = 0;
    }

    componentIndexes[prefix] += 1;
    ref.current = componentIndexes[prefix];
    return () => {
      componentIndexes[prefix] -= 1;
    };
  }, [prefix]);

  return ref.current;
};
