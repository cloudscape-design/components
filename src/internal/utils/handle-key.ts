// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { KeyCode } from '../keycode';
import { isRtl } from '../direction';

interface EventLike {
  keyCode: number;
  currentTarget: HTMLElement;
}

export default function handleKey(
  event: EventLike,
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
    onActivate?: () => void;
    onBlockEnd?: () => void;
    onBlockStart?: () => void;
    onEnd?: () => void;
    onHome?: () => void;
    onInlineEnd?: () => void;
    onInlineStart?: () => void;
    onPageDown?: () => void;
    onPageUp?: () => void;
  }
) {
  switch (event.keyCode) {
    case KeyCode.down:
      onBlockEnd?.();
      break;
    case KeyCode.end:
      onEnd?.();
      break;
    case KeyCode.enter:
    case KeyCode.space:
      onActivate?.();
      break;
    case KeyCode.home:
      onHome?.();
      break;
    case KeyCode.left:
      isRtl(event.currentTarget) ? onInlineEnd?.() : onInlineStart?.();
      break;
    case KeyCode.pageDown:
      onPageDown?.();
      break;
    case KeyCode.pageUp:
      onPageUp?.();
      break;
    case KeyCode.right:
      isRtl(event.currentTarget) ? onInlineStart?.() : onInlineEnd?.();
      break;
    case KeyCode.up:
      onBlockStart?.();
      break;
  }
}
