// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

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
  // if no prefix provided, add a letter at the beginning to ensure valid HTML id
  return `${prefix ? prefix : 'i'}` + useId();
}
