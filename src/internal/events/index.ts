// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseKeyDetail, CancelableEventHandler, NonCancelableEventHandler } from '../../types/events';

// Backward-compatibility re-export for consumers importing this public type from the internal path.
export type {
  BaseKeyDetail,
  BaseNavigationDetail,
  CancelableEventHandler,
  ClickDetail,
  NonCancelableCustomEvent,
  NonCancelableEventHandler,
} from '../../types/events';

class CustomEventStub<T> {
  defaultPrevented = false;
  cancelBubble = false;
  constructor(
    public cancelable: boolean = false,
    public detail: T | null = null
  ) {}

  preventDefault() {
    this.defaultPrevented = true;
  }

  stopPropagation() {
    this.cancelBubble = true;
  }
}

export function createCustomEvent<T>({ cancelable, detail }: CustomEventInit<T>): CustomEvent<T> {
  return new CustomEventStub(cancelable, detail) as CustomEvent;
}

export function fireNonCancelableEvent<T = null>(handler: NonCancelableEventHandler<T> | undefined, detail?: T) {
  if (!handler) {
    return;
  }
  const event = createCustomEvent({ cancelable: false, detail });
  handler(event);
}

export function fireCancelableEvent<T>(
  handler: CancelableEventHandler<T> | undefined,
  detail: T,
  sourceEvent?: React.SyntheticEvent | Event
) {
  if (!handler) {
    return false;
  }
  const event = createCustomEvent({ cancelable: true, detail });
  handler(event);
  if (event.defaultPrevented && sourceEvent) {
    sourceEvent.preventDefault();
  }
  if (event.cancelBubble && sourceEvent) {
    sourceEvent.stopPropagation();
  }
  return event.defaultPrevented;
}

export function fireKeyboardEvent(
  handler: CancelableEventHandler<BaseKeyDetail> | undefined,
  reactEvent: React.KeyboardEvent
) {
  return fireCancelableEvent(
    handler,
    {
      keyCode: reactEvent.keyCode,
      key: reactEvent.key,
      ctrlKey: reactEvent.ctrlKey,
      shiftKey: reactEvent.shiftKey,
      altKey: reactEvent.altKey,
      metaKey: reactEvent.metaKey,
      isComposing: reactEvent.nativeEvent.isComposing,
    },
    reactEvent
  );
}

const isMouseEvent = (e: React.MouseEvent | React.KeyboardEvent): e is React.MouseEvent => {
  return (e as React.MouseEvent).button !== undefined;
};

export function hasModifierKeys(event: React.MouseEvent | React.KeyboardEvent) {
  return event.ctrlKey || event.altKey || event.shiftKey || event.metaKey;
}

export function isPlainLeftClick(event: React.MouseEvent | React.KeyboardEvent) {
  return event && (!isMouseEvent(event) || event.button === 0) && !hasModifierKeys(event);
}
