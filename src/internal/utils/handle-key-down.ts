// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { KeyCode } from '../keycode';

export default function handleKeyDown({
  onActivate,
  onAll,
  onBlockEnd,
  onBlockStart,
  onEnter,
  onEscape,
  onInlineEnd,
  onInlineStart,
  onSpace,
  onTab,
  default: defaultFunction,
}: {
  onActivate?: (event: React.KeyboardEvent) => void;
  onAll?: (event: React.KeyboardEvent) => void;
  onBlockEnd?: (event: React.KeyboardEvent) => void;
  onBlockStart?: (event: React.KeyboardEvent) => void;
  onEnter?: (event: React.KeyboardEvent) => void;
  onEscape?: (event: React.KeyboardEvent) => void;
  onInlineEnd?: (event: React.KeyboardEvent) => void;
  onInlineStart?: (event: React.KeyboardEvent) => void;
  onSpace?: (event: React.KeyboardEvent) => void;
  onTab?: (event: React.KeyboardEvent) => void;
  default?: (event: React.KeyboardEvent) => void;
}) {
  return function (event: React.KeyboardEvent) {
    const direction = getComputedStyle(event.currentTarget).direction ?? 'ltr';

    onAll && onAll(event);

    switch (event.keyCode) {
      case KeyCode.enter:
        onEnter && onEnter(event);
        onActivate && onActivate(event);
        break;
      case KeyCode.space:
        onSpace && onSpace(event);
        onActivate && onActivate(event);
        break;
      case KeyCode.escape:
        onEscape && onEscape(event);
        break;
      case KeyCode.down:
        onBlockEnd && onBlockEnd(event);
        break;
      case KeyCode.left:
        direction === 'ltr' ? onInlineStart && onInlineStart(event) : onInlineEnd && onInlineEnd(event);
        break;
      case KeyCode.right:
        direction === 'ltr' ? onInlineEnd && onInlineEnd(event) : onInlineStart && onInlineStart(event);
        break;
      case KeyCode.tab:
        onTab && onTab(event);
        break;
      case KeyCode.up:
        onBlockStart && onBlockStart(event);
        break;
      default:
        defaultFunction && defaultFunction(event);
    }
  };
}
