// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { KeyCode } from '../keycode';
import { isRtl } from '../direction';

export function isEventLike(event: any): event is EventLike {
  return event.currentTarget instanceof HTMLElement;
}

export interface EventLike {
  keyCode: number;
  currentTarget: Document | HTMLElement | SVGElement;
}

export default function handleKey(
  event: EventLike,
  {
    onActivate,
    onBlockEnd,
    onBlockStart,
    onDefault,
    onEnd,
    onEscape,
    onHome,
    onInlineEnd,
    onInlineStart,
    onPageDown,
    onPageUp,
  }: {
    onActivate?: () => void;
    onBlockEnd?: () => void;
    onBlockStart?: () => void;
    onDefault?: () => void;
    onEnd?: () => void;
    onEscape?: () => void;
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
    case KeyCode.escape:
      onEscape?.();
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
    default:
      onDefault?.();
      break;
  }
}
