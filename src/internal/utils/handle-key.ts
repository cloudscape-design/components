// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getIsRtl } from '@cloudscape-design/component-toolkit/internal';

import { KeyCode, KeyCodeA, KeyCodeDelete } from '../keycode';
import { isHTMLElement, isSVGElement } from './dom';

export function isEventLike(event: any): event is EventLike {
  return isHTMLElement(event.currentTarget) || isSVGElement(event.currentTarget);
}

export interface EventLike {
  keyCode: number;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  currentTarget: HTMLElement | SVGElement;
}

export default function handleKey(
  event: EventLike,
  {
    onActivate,
    onBackspace,
    onBlockEnd,
    onBlockStart,
    onDefault,
    onDelete,
    onEnd,
    onEnter,
    onEscape,
    onHome,
    onInlineEnd,
    onInlineStart,
    onPageDown,
    onPageUp,
    onSelectAll,
    onShiftEnter,
    onShiftInlineEnd,
    onShiftInlineStart,
    onSpace,
    onTab,
  }: {
    onActivate?: () => void;
    onBackspace?: () => void;
    onBlockEnd?: () => void;
    onBlockStart?: () => void;
    onDefault?: () => void;
    onDelete?: () => void;
    onEnd?: () => void;
    onEnter?: () => void;
    onEscape?: () => void;
    onHome?: () => void;
    onInlineEnd?: () => void;
    onInlineStart?: () => void;
    onPageDown?: () => void;
    onPageUp?: () => void;
    onSelectAll?: () => void;
    onShiftEnter?: () => void;
    onShiftInlineEnd?: () => void;
    onShiftInlineStart?: () => void;
    onSpace?: () => void;
    onTab?: () => void;
  }
) {
  switch (event.keyCode) {
    case KeyCodeA:
      if ((event.ctrlKey || event.metaKey) && onSelectAll) {
        onSelectAll();
      } else {
        onDefault?.();
      }
      break;
    case KeyCode.backspace:
      // TODO: Remove onDefault fallback once all callers handle backspace explicitly
      if (onBackspace) {
        onBackspace();
      } else {
        onDefault?.();
      }
      break;
    case KeyCodeDelete:
      // TODO: Remove onDefault fallback once all callers handle delete explicitly
      if (onDelete) {
        onDelete();
      } else {
        onDefault?.();
      }
      break;
    case KeyCode.down:
      onBlockEnd?.();
      break;
    case KeyCode.end:
      onEnd?.();
      break;
    case KeyCode.enter:
      if (event.shiftKey && onShiftEnter) {
        onShiftEnter();
      } else if (onEnter) {
        onEnter();
      } else {
        onActivate?.();
      }
      break;
    case KeyCode.escape:
      onEscape?.();
      break;
    case KeyCode.home:
      onHome?.();
      break;
    case KeyCode.left:
      if (event.shiftKey && (onShiftInlineStart || onShiftInlineEnd)) {
        getIsRtl(event.currentTarget) ? onShiftInlineEnd?.() : onShiftInlineStart?.();
        break;
      }
      getIsRtl(event.currentTarget) ? onInlineEnd?.() : onInlineStart?.();
      break;
    case KeyCode.pageDown:
      onPageDown?.();
      break;
    case KeyCode.pageUp:
      onPageUp?.();
      break;
    case KeyCode.right:
      if (event.shiftKey && (onShiftInlineStart || onShiftInlineEnd)) {
        getIsRtl(event.currentTarget) ? onShiftInlineStart?.() : onShiftInlineEnd?.();
        break;
      }
      getIsRtl(event.currentTarget) ? onInlineStart?.() : onInlineEnd?.();
      break;
    case KeyCode.space:
      if (onSpace) {
        onSpace();
      } else {
        onActivate?.();
      }
      break;
    case KeyCode.tab:
      // TODO: Remove onDefault fallback once all callers handle tab explicitly
      if (onTab) {
        onTab();
      } else {
        onDefault?.();
      }
      break;
    case KeyCode.up:
      onBlockStart?.();
      break;
    default:
      onDefault?.();
      break;
  }
}
