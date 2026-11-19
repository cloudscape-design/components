// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export enum ElementType {
  Reference = 'reference',
  Pinned = 'pinned',
  CaretSpotBefore = 'cursor-spot-before',
  CaretSpotAfter = 'cursor-spot-after',
  Trigger = 'trigger',
  TrailingBreak = 'trailing-break',
}

export const SPECIAL_CHARS = {
  ZERO_WIDTH_CHARACTER: '\u200B',
  NEWLINE: '\n',
};

export const DEFAULT_MAX_ROWS = 3;
export const NEXT_TICK_TIMEOUT = 0;
