// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { KeyCode } from '../keycode';
import { isRtl } from '../direction';

export default function handleKey(
  event: React.KeyboardEvent<HTMLElement>,
  {
    onActivate,
    onBlockEnd,
    onBlockStart,
    onEnd,
    onHome,
    onInlineEnd,
    onInlineStart,
    onPageDown,
    onPageUp,
  }: {
    onActivate?: (event: React.KeyboardEvent) => void;
    onBlockEnd?: (event: React.KeyboardEvent) => void;
    onBlockStart?: (event: React.KeyboardEvent) => void;
    onEnd?: (event: React.KeyboardEvent) => void;
    onHome?: (event: React.KeyboardEvent) => void;
    onInlineEnd?: (event: React.KeyboardEvent) => void;
    onInlineStart?: (event: React.KeyboardEvent) => void;
    onPageDown?: (event: React.KeyboardEvent) => void;
    onPageUp?: (event: React.KeyboardEvent) => void;
  }
) {
  switch (event.keyCode) {
    case KeyCode.down:
      onBlockEnd?.(event);
      break;
    case KeyCode.end:
      onEnd?.(event);
      break;
    case KeyCode.enter:
    case KeyCode.space:
      onActivate?.(event);
      break;
    case KeyCode.home:
      onHome?.(event);
      break;
    case KeyCode.left:
      isRtl(event.currentTarget) ? onInlineEnd?.(event) : onInlineStart?.(event);
      break;
    case KeyCode.pageDown:
      onPageDown?.(event);
      break;
    case KeyCode.pageUp:
      onPageUp?.(event);
      break;
    case KeyCode.right:
      isRtl(event.currentTarget) ? onInlineStart?.(event) : onInlineEnd?.(event);
      break;
    case KeyCode.up:
      onBlockStart?.(event);
      break;
  }
}
