// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Simplified version of ResizeObserverEntry
export interface ContainerQueryEntry {
  target: Element;
  contentBoxWidth: number;
  contentBoxHeight: number;
  borderBoxWidth: number;
  borderBoxHeight: number;
  width: number; // Same as contentWidth, added for consistency with old API
  height: number; // Same as contentHeight, added for consistency with old API
}
