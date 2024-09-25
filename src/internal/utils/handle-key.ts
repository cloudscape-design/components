// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getIsRtl } from '@cloudscape-design/component-toolkit/internal';

import { KeyCode } from '../keycode';
import { isHTMLElement, isSVGElement } from './dom';

export function isEventLike(event: any): event is EventLike {
  return isHTMLElement(event.currentTarget) || isSVGElement(event.currentTarget);
}

export interface EventLike {
  keyCode: number;
  currentTarget: HTMLElement | SVGElement;
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
      getIsRtl(event.currentTarget) ? onInlineEnd?.() : onInlineStart?.();
      break;
    case KeyCode.pageDown:
      onPageDown?.();
      break;
    case KeyCode.pageUp:
      onPageUp?.();
      break;
    case KeyCode.right:
      getIsRtl(event.currentTarget) ? onInlineStart?.() : onInlineEnd?.();
      break;
    case KeyCode.up:
      onBlockStart?.();
      break;
    default:
      onDefault?.();
      break;
  }
}
