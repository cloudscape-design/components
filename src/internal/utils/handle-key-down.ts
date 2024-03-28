// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { KeyCode } from '../keycode';

export default function handleKeyDown({
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
}) {
  return function (event: React.KeyboardEvent) {
    const direction = getComputedStyle(event.currentTarget).direction === 'rtl' ? 'rtl' : 'ltr';

    switch (event.keyCode) {
      case KeyCode.down:
        onBlockEnd?.(event);
        break;
      case KeyCode.end:
        onEnd?.(event);
        break;
      case KeyCode.enter:
        onActivate?.(event);
        break;
      case KeyCode.home:
        onHome?.(event);
        break;
      case KeyCode.left:
        direction === 'ltr' ? onInlineStart?.(event) : onInlineEnd?.(event);
        break;
      case KeyCode.pageDown:
        onPageDown?.(event);
        break;
      case KeyCode.pageUp:
        onPageUp?.(event);
        break;
      case KeyCode.right:
        direction === 'ltr' ? onInlineEnd?.(event) : onInlineStart?.(event);
        break;
      case KeyCode.space:
        onActivate?.(event);
        break;
      case KeyCode.up:
        onBlockStart?.(event);
        break;
    }
  };
}
