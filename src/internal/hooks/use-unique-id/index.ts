// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

let counter = 0;
export const useRandomId = () => {
  const idRef = useRef<string | null>(null);
  if (!idRef.current) {
    idRef.current = `${counter++}-${Date.now()}-${Math.round(Math.random() * 10000)}`;
  }
  return idRef.current;
};

const useId: typeof useRandomId = (React as any).useId ?? useRandomId;

export function useUniqueId(prefix?: string) {
  return `${prefix ? prefix : ''}` + useId();
}
