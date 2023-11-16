// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { isMotionDisabled } from '@cloudscape-design/component-toolkit/internal';
import isNativeSmoothScrollingSupported from './native-smooth-scroll-supported';

interface ScrollContext {
  scrollable: HTMLElement;
  startX: number;
  endX: number;
  startTime: number;
  scrollTime: number;
}

// The scroll speed depends on the scrolling distance. The equation below is an interpolation of measurements in Chrome.
const getScrollSpeed = (pixels: number) => 0.0015 * Math.abs(pixels) + 0.558;
const getScrollTime = (pixels: number) => Math.round(Math.abs(pixels) / getScrollSpeed(pixels));

const now = () => (window.performance ? window.performance.now() : Date.now());

const ease = (k: number): number => {
  return 0.5 * (1 - Math.cos(Math.PI * k));
};

const step = (context: ScrollContext): void => {
  const time = now();
  const elapsed = Math.min((time - context.startTime) / context.scrollTime, 1);
  const value = ease(elapsed);
  const currentX = context.startX + (context.endX - context.startX) * value;
  context.scrollable.scrollLeft = currentX;
  // scroll more if we have not reached our destination
  if (currentX !== context.endX) {
    requestAnimationFrame(() => step(context));
  }
};

const simulateSmoothScroll = (element: HTMLElement, endX: number): void => {
  const startX = element.scrollLeft;
  step({
    scrollable: element,
    startX,
    endX,
    startTime: now(),
    scrollTime: getScrollTime(endX - startX),
  });
};

const smoothScroll = (element: HTMLElement, to: number) => {
  if (isMotionDisabled(element)) {
    element.scrollLeft = to;
    return;
  }
  if (isNativeSmoothScrollingSupported() && element.scrollTo) {
    element.scrollTo({
      left: to,
      behavior: 'smooth',
    });
    return;
  }
  simulateSmoothScroll(element, to);
};

export default smoothScroll;
