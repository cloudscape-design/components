// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { animate } from '../animate';

describe('animate', () => {
  const originalFn = window.requestAnimationFrame;

  beforeEach(() => {
    window.requestAnimationFrame = (fn: FrameRequestCallback) => {
      return setTimeout(fn, 0);
    };
  });

  afterEach(() => {
    window.requestAnimationFrame = originalFn;
  });

  it("removes transforms when it's finished", done => {
    const element = document.createElement('div');
    animate({
      oldState: { a: { width: 1, height: 1, bottom: 1, left: 1, top: 1, right: 1, x: 1, y: 1, toJSON: () => void 0 } },
      elements: { a: element },
    });
    setTimeout(() => {
      expect(element.style?.transform).toBeFalsy();
      done();
    }, 0);
  });
});
