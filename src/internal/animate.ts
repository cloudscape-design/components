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
  - https://aerotwist.com/blog/flip-your-animations/
  - https://css-tricks.com/animating-layouts-with-the-flip-technique/

  This can be useful when the initial dimensions or position of the element is not known,
  so the initial offset or scaling needs to be retrieved via JS.

  Caveat: this currently does not support elements having CSS transforms in the end state.
  These would be overriden in the animation instead of combined.
 */
export function animate({
  oldState,
  elements,
  onTransitionsEnd,
  newElementInitialState,
}: {
  elements: Record<string | number, HTMLElement | null>;
  oldState: Record<string | number, DOMRect>;
  onTransitionsEnd?: () => void;
  newElementInitialState?: (newRect: DOMRect) => { scale?: number; y?: number };
}) {
  // First, apply the transform that will make the elements "look like" in the start position
  for (const id in elements) {
    const element = elements[id];
    if (element) {
      const newRect = element.getBoundingClientRect();
      const oldRect = oldState[id];
      const noOpTransform = { scale: 1, y: 0 };
      // Calculate initial position.
      // If the element didn't exist previously, use the newElementInitialState function if provided.
      // If not, default to no transitions (scale: 1, y: 0)
      const calculatedInvertTransform = oldRect
        ? { scale: oldRect.width / newRect.width, y: oldRect.bottom - newRect.bottom }
        : newElementInitialState
        ? newElementInitialState(newRect)
        : {};
      const inverseTransform = { ...noOpTransform, ...calculatedInvertTransform };
      // Apply this initial change, without animating
      element.style.transitionProperty = 'none';
      element.style.transform = `scale(${inverseTransform.scale}) translateY(${inverseTransform.y}px)`;
      if (!oldRect) {
        // If the element didn't exist, then fade it in
        // (besides any other possibly defined transitions based on `newElementInitialState`)
        element.style.opacity = '0';
      }
    }
  }

  // Animate from the initial state to the end state
  requestAnimationFrame(() => {
    const ongoingAnimations = new Set();
    for (const id in elements) {
      const element = elements[id];
      if (element) {
        const oldRect = oldState[id];
        if (oldRect) {
          // Animate from here on
          element.style.transitionProperty = `transform`;
          // Unset inline CSS transforms so that the final state is applied
          element.style.transform = '';
        } else {
          // If the element didn't exist previously, fade in as well
          element.style.transitionProperty = `transform, opacity`;
          element.style.transform = '';
          element.style.opacity = '';
        }
        const onTransitionStart = (event: TransitionEvent) => {
          if (event.target === element) {
            ongoingAnimations.add(id);
            element.removeEventListener('transitionstart', onTransitionStart);
          }
        };
        const onTransitionEnd = (event: TransitionEvent) => {
          if (event.target === element) {
            // Clean up remaining inline styles
            element.style.transitionProperty = '';
            element.removeEventListener('transitionstart', onTransitionEnd);
            if (onTransitionsEnd) {
              ongoingAnimations.delete(id);
              if (ongoingAnimations.size === 0) {
                onTransitionsEnd();
              }
            }
          }
        };
        element.addEventListener('transitionstart', onTransitionStart);
        element.addEventListener('transitionend', onTransitionEnd);
      }
    }
  });
}
