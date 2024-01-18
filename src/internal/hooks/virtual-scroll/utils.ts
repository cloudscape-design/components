// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const DEFAULT_OVERSCAN = 5;

export function createVirtualIndices({
  frameStart,
  frameSize,
  overscan = DEFAULT_OVERSCAN,
  totalSize,
}: {
  frameStart: number;
  frameSize: number;
  overscan?: number;
  totalSize: number;
}): number[] {
  const frame: number[] = [];
  for (let i = Math.max(0, frameStart - overscan); i < frameStart + frameSize && i < totalSize; i++) {
    frame.push(i);
  }
  return frame;
}
