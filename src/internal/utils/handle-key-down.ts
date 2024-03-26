// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { KeyCode } from '../keycode';

export default function handleKeyDown({
  onActivate,
  onAll,
  onEnter,
  onEscape,
  onDown,
  onLeft,
  onRight,
  onSpace,
  onTab,
  onUp,
  default: defaultFunction,
}: {
  onActivate?: (event: React.KeyboardEvent) => void;
  onAll?: (event: React.KeyboardEvent) => void;
  onEnter?: (event: React.KeyboardEvent) => void;
  onSpace?: (event: React.KeyboardEvent) => void;
  onEscape?: (event: React.KeyboardEvent) => void;
  onDown?: (event: React.KeyboardEvent) => void;
  onLeft?: (event: React.KeyboardEvent) => void;
  onRight?: (event: React.KeyboardEvent) => void;
  onTab?: (event: React.KeyboardEvent) => void;
  onUp?: (event: React.KeyboardEvent) => void;
  default?: (event: React.KeyboardEvent) => void;
}) {
  return function (event: React.KeyboardEvent) {
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
        onDown && onDown(event);
        break;
      case KeyCode.left:
        onLeft && onLeft(event);
        break;
      case KeyCode.right:
        onRight && onRight(event);
        break;
      case KeyCode.tab:
        onTab && onTab(event);
        break;
      case KeyCode.up:
        onUp && onUp(event);
        break;
      default:
        defaultFunction && defaultFunction(event);
    }
  };
}
