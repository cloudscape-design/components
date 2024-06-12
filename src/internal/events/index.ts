// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

// This is a part of our public types API. We cannot change this in the current major version
// eslint-disable-next-line @typescript-eslint/ban-types
export type NonCancelableEventHandler<Detail = {}> = (event: NonCancelableCustomEvent<Detail>) => void;
// eslint-disable-next-line @typescript-eslint/ban-types
export type CancelableEventHandler<Detail = {}> = (event: CustomEvent<Detail>) => void;

export type NonCancelableCustomEvent<DetailType> = Omit<CustomEvent<DetailType>, 'preventDefault'>;

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

export interface BaseKeyDetail {
  keyCode: number;
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

export interface ClickDetail {
  button: number;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

export interface BaseNavigationDetail {
  href: string | undefined;
  external?: boolean;
  target?: string;
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

export function fireKeyboardEvent(handler: CancelableEventHandler<BaseKeyDetail>, reactEvent: React.KeyboardEvent) {
  return fireCancelableEvent(
    handler,
    {
      keyCode: reactEvent.keyCode,
      key: reactEvent.key,
      ctrlKey: reactEvent.ctrlKey,
      shiftKey: reactEvent.shiftKey,
      altKey: reactEvent.altKey,
      metaKey: reactEvent.metaKey,
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
