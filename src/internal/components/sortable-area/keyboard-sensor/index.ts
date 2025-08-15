// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import type { Activators, SensorContext, SensorInstance, SensorProps, UniqueIdentifier } from '@dnd-kit/core';
import { defaultCoordinates, KeyboardCode } from '@dnd-kit/core';
import { KeyboardSensorOptions } from '@dnd-kit/core';
import {
  Coordinates,
  getOwnerDocument,
  getWindow,
  isKeyboardEvent,
  subtract as getCoordinatesDelta,
} from '@dnd-kit/utilities';

import { scrollElementIntoView } from '../../../utils/scrollable-containers';
import { defaultKeyboardCodes } from './defaults';
import { EventName } from './utilities/events';
import { Listeners } from './utilities/listeners';
import { applyScroll } from './utilities/scroll';

// Heavily modified version of @dnd-kit's KeyboardSensor, to add support for "UAP"-button pointer interactions.
// https://github.com/clauderic/dnd-kit/blob/master/packages/core/src/sensors/keyboard/KeyboardSensor.ts

export type KeyboardAndUAPCoordinateGetter = (
  event: Event,
  args: {
    active: UniqueIdentifier;
    currentCoordinates: Coordinates;
    context: SensorContext;
  }
) => Coordinates | void;

type KeyboardAndUAPSensorOptions = KeyboardSensorOptions & {
  coordinateGetter: KeyboardAndUAPCoordinateGetter;
  onActivation?({ event }: { event: KeyboardEvent | MouseEvent }): void;
};

export class KeyboardAndUAPSensor implements SensorInstance {
  public autoScrollEnabled = false;
  private referenceCoordinates: Coordinates | undefined;
  private listeners: Listeners;
  private windowListeners: Listeners;

  constructor(private props: SensorProps<KeyboardAndUAPSensorOptions>) {
    const {
      event: { target },
    } = props;

    this.props = props;
    this.listeners = new Listeners(getOwnerDocument(target));
    this.windowListeners = new Listeners(getWindow(target));
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleCustomDirectionEvent = this.handleCustomDirectionEvent.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.attach();
  }

  private attach() {
    this.handleStart();

    this.windowListeners.add(EventName.Resize, this.handleCancel);
    this.windowListeners.add(EventName.VisibilityChange, this.handleCancel);

    this.props.event.target?.addEventListener(EventName.Blur, this.handleEnd);

    setTimeout(() => {
      this.listeners.add(EventName.Keydown, this.handleKeyDown);
      this.listeners.add(EventName.CustomDown, this.handleCustomDirectionEvent);
      this.listeners.add(EventName.CustomUp, this.handleCustomDirectionEvent);
    });
  }

  private handleStart() {
    const { activeNode, onStart } = this.props;
    const node = activeNode.node.current;

    if (node) {
      scrollElementIntoView(node);
    }

    onStart(defaultCoordinates);
  }

  private handleKeyDown(event: Event) {
    if (isKeyboardEvent(event)) {
      const { options } = this.props;
      const { keyboardCodes = defaultKeyboardCodes } = options;
      const { code } = event;

      if (keyboardCodes.end.indexOf(code) !== -1) {
        this.handleEnd(event);
        return;
      }

      if (keyboardCodes.cancel.indexOf(code) !== -1) {
        this.handleCancel(event);
        return;
      }

      switch (code) {
        case KeyboardCode.Up:
          this.handleDirectionalMove(event, 'up');
          break;
        case KeyboardCode.Down:
          this.handleDirectionalMove(event, 'down');
          break;
      }
    }
  }

  private handleCustomDirectionEvent(event: Event) {
    switch (event.type) {
      case EventName.CustomUp:
        this.handleDirectionalMove(event, 'up');
        break;
      case EventName.CustomDown:
        this.handleDirectionalMove(event, 'down');
        break;
    }
  }

  private handleDirectionalMove(event: Event, direction: 'up' | 'down') {
    const { active, context, options } = this.props;
    const { coordinateGetter } = options;
    const { collisionRect } = context.current;
    const currentCoordinates = collisionRect ? { x: collisionRect.left, y: collisionRect.top } : defaultCoordinates;

    if (!this.referenceCoordinates) {
      this.referenceCoordinates = currentCoordinates;
    }

    const newCoordinates = coordinateGetter(event, {
      active,
      context: context.current,
      currentCoordinates,
    });

    if (newCoordinates) {
      const { scrollableAncestors } = context.current;

      const scrolled = applyScroll({ currentCoordinates, direction, newCoordinates, scrollableAncestors });

      if (!scrolled) {
        this.handleMove(event, getCoordinatesDelta(newCoordinates, this.referenceCoordinates));
      }
    }
  }

  private handleMove(event: Event, coordinates: Coordinates) {
    const { onMove } = this.props;

    event.preventDefault();
    onMove(coordinates);
  }

  private handleEnd(event: Event) {
    const { onEnd } = this.props;

    event.preventDefault();
    this.detach();
    onEnd();
  }

  private handleCancel(event: Event) {
    const { onCancel } = this.props;

    if (event.type !== EventName.Blur) {
      event.preventDefault();
    }
    this.detach();
    onCancel();
  }

  private detach() {
    this.props.event.target?.removeEventListener(EventName.Blur, this.handleCancel);

    this.listeners.removeAll();
    this.windowListeners.removeAll();
  }

  static activators: Activators<KeyboardAndUAPSensorOptions> = [
    {
      eventName: 'onKeyDown',
      handler: (event: React.KeyboardEvent, { keyboardCodes = defaultKeyboardCodes, onActivation }, { active }) => {
        const { code } = event.nativeEvent;

        if (keyboardCodes.start.indexOf(code) !== -1) {
          const activator = active.activatorNode.current;

          if (activator && event.target !== activator) {
            return false;
          }

          event.preventDefault();

          onActivation?.({ event: event.nativeEvent });

          return true;
        }

        return false;
      },
    },
    {
      eventName: 'onClick',
      handler: ({ nativeEvent: event }: React.MouseEvent, { onActivation }) => {
        if (event.button !== 0) {
          return false;
        }

        onActivation?.({ event });

        return true;
      },
    },
  ];
}
