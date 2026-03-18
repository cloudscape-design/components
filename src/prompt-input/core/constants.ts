// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type ElementType =
  | 'reference'
  | 'pinned'
  | 'cursor-spot-before'
  | 'cursor-spot-after'
  | 'trigger'
  | 'trailing-break';

export const ELEMENT_TYPES: Record<string, ElementType> = {
  REFERENCE: 'reference',
  PINNED: 'pinned',
  CURSOR_SPOT_BEFORE: 'cursor-spot-before',
  CURSOR_SPOT_AFTER: 'cursor-spot-after',
  TRIGGER: 'trigger',
  TRAILING_BREAK: 'trailing-break',
};

export const SPECIAL_CHARS = {
  ZWNJ: '\u200B',
  NEWLINE: '\n',
};

export const DEFAULT_MAX_ROWS = 3;
export const NEXT_TICK_TIMEOUT = 0;
export const CARET_DETECTION_DELAY = 100;
