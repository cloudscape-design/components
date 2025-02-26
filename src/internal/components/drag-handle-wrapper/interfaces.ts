// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface MoveButtonBlockLabels {
  resizeTooltipText: string; // "Drag or select to move"
  moveBlockStart: string; // "Move up"
  moveBlockEnd: string; // "Move down"
}

export interface MoveButtonInlineLabels {
  resizeTooltipText: string; // "Drag or select to move"
  moveInlineStart: string; // "Move back"
  moveInlineEnd: string; // "Move forward"
}

export interface ResizeButtonBlockLabels {
  resizeTooltipText: string; // "Drag or select to move"
  resizeBlockStart: string; // "Resize vertically up"
  resizeBlockEnd: string; // "Resize vertically down"
}

export interface ResizeButtonInlineLabels {
  resizeTooltipText: string; // "Drag or select to move"
  resizeInlineStart: string; // "Resize horizontally <smaller?>"
  resizeInlineEnd: string; // "Resize horizontally <larger?>"
}
