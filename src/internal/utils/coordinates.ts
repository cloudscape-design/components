// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PointerEvent as ReactPointerEvent } from 'react';

export class Coordinates {
  readonly __type = 'Coordinates';
  readonly x: number;
  readonly y: number;
  readonly scrollX = window.scrollX;
  readonly scrollY = window.scrollY;

  static fromEvent(event: PointerEvent | ReactPointerEvent<unknown>): Coordinates {
    return new Coordinates({ x: event.clientX, y: event.clientY });
  }

  static cursorOffset(current: Coordinates, start: Coordinates): Coordinates {
    return new Coordinates({
      x: current.x - start.x + (current.scrollX - start.scrollX),
      y: current.y - start.y + (current.scrollY - start.scrollY),
    });
  }

  constructor({ x, y }: { x: number; y: number }) {
    this.x = x;
    this.y = y;
  }
}
