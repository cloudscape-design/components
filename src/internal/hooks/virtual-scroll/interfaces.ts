// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface Virtualizer {
  frame: readonly VirtualItem[];
  totalSize: number;
  scrollToIndex: (index: number) => void;
}

export interface VirtualItem extends InternalVirtualItem {
  measureRef: (node: null | HTMLElement) => void;
}

export interface InternalVirtualItem {
  index: number;
  start: number;
}

export interface InternalFrameUpdate {
  frame: null | readonly InternalVirtualItem[];
  totalSize: number;
}
