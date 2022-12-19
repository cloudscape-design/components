// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function getDOMRects(elements: Record<string | number, HTMLElement | null>) {
  const rects: Record<string, DOMRect> = {};
  for (const id in elements) {
    const element = elements[id];
    if (element) {
      rects[id] = element.getBoundingClientRect();
    }
  }
  return rects;
}

/*
  Animate DOM elements based on the FLIP technique
 */
export function animate({
  oldState,
  elements,
  onTransitionEnd,
}: {
  elements: Record<string | number, HTMLElement | null>;
  oldState: Record<string | number, DOMRect>;
  onTransitionEnd?: () => void;
}) {
  // First, apply the transform that will make the elements "look like" in the start position
  for (const id in elements) {
    const element = elements[id];
    if (element) {
      const { bottom, top, width } = element.getBoundingClientRect();
      const oldRect = oldState[id];
      // If the element didn't exist previously, then we apply a light zoom-in and top-to-bottom animation
      const invert = oldRect
        ? { scale: oldRect.width / width, y: oldRect.bottom - bottom }
        : { scale: 0.6, y: -0.2 * top };
      // Make sure that the element adopts this change without animating
      element.style.transitionProperty = 'none';
      element.style.transform = `scale(${invert.scale}) translateY(${invert.y}px)`;
      if (!oldRect) {
        // If the element didn't exist, then fade it in
        // (besides the other subtle zoom-in and top-to-bottom animations mentioned above)
        element.style.opacity = '0';
      }
    }
  }

  requestAnimationFrame(() => {
    for (const id in elements) {
      const element = elements[id];
      if (element) {
        const oldRect = oldState[id];
        if (oldRect) {
          element.style.transitionProperty = `transform`;
          element.style.transform = '';
        } else {
          element.style.transitionProperty = `transform, opacity`;
          element.style.transform = '';
          element.style.opacity = '';
        }
        const cleanUpAnimations = (event: TransitionEvent) => {
          if (event.target === element) {
            element.style.transitionProperty = '';
            if (onTransitionEnd) {
              onTransitionEnd();
            }
          }
        };
        element.addEventListener('transitionend', cleanUpAnimations);
      }
    }
  });
}
