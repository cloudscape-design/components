// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef } from 'react';

let counter = 0;
export function generateUniqueId(prefix?: string) {
  return `${prefix ? prefix : ''}${counter++}-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

export function useUniqueId(prefix?: string) {
  const idRef = useRef<string | null>(null);
  if (!idRef.current) {
    idRef.current = generateUniqueId(prefix);
  }
  return idRef.current;
}
