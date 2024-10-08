// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { isMotionDisabled } from '@cloudscape-design/component-toolkit/internal';

/**
 * Call scrollTo on an element. Uses smooth scroll behavior only if motion is enabled.
 */
export function smoothScroll(element: Element, options: Omit<ScrollToOptions, 'behavior'>): void {
  element.scrollTo({
    left: options.left,
    top: options.top,
    // Fine for now - isMotionDisabled doesn't strictly rely on HTMLElement properties.
    behavior: !isMotionDisabled(element as HTMLElement) ? 'smooth' : undefined,
  });
}
