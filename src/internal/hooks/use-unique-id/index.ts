// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

let counter = 0;
export function generateUniqueId(prefix = '') {
  return `${prefix}${counter++}-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

export function useUniqueId(prefix = '') {
  const idRef = useRef<string | null>(null);

  // useId is only available in React 18+
  if ((React as ReactWithUseId).useId !== undefined) {
    return prefix + (React as ReactWithUseId).useId();
  }

  if (!idRef.current) {
    idRef.current = generateUniqueId(prefix);
  }
  return idRef.current;
}

type ReactWithUseId = typeof React & {
  // See https://github.com/DefinitelyTyped/DefinitelyTyped/blob/cc9a28eb5e1953f8f74ade87d7f16a8db8ab7552/types/react/index.d.ts#L1157
  useId(): string;
};
