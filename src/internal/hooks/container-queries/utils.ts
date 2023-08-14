// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ResizeObserverEntry } from '@juggle/resize-observer';
import { ContainerQueryEntry } from '@cloudscape-design/component-toolkit';

export function convertResizeObserverEntry(entry: ResizeObserverEntry): ContainerQueryEntry {
  return {
    target: entry.target,
    contentBoxWidth: entry.contentBoxSize[0].inlineSize,
    contentBoxHeight: entry.contentBoxSize[0].blockSize,
    borderBoxWidth: entry.borderBoxSize[0].inlineSize,
    borderBoxHeight: entry.borderBoxSize[0].blockSize,
  };
}
