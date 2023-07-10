// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import React from 'react';

export default function useContainerWidth(
  defaultValue = 0,
  threshold = 1
): [width: number, ref: React.Ref<HTMLDivElement>] {
  const [width, ref] = useContainerQuery<number>((rect, prev) => {
    if (prev === null) {
      return rect.contentBoxWidth;
    }
    return Math.abs(prev - rect.contentBoxWidth) >= threshold ? rect.contentBoxWidth : prev;
  });

  return [width ?? defaultValue, ref];
}
