// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { nodeContains } from '@cloudscape-design/component-toolkit/dom';

import { findUpUntil } from './dom';

// We avoid instanceof Node/HTMLElement checks as the interfaces are tied to the window they are created in.
// If an element was moved to an iframe after it was created, then element instanceof Node/HTMLElement
// will be false since the interface has a different window.

/**
 * Checks whether the given node (target) belongs to the container.
 * The function is similar to nodeContains but also accounts for dropdowns with expandToViewport=true.
 *
 * @param container Container node
 * @param target Node that is checked to be a descendant of the container
 */
export function nodeBelongs(container: Node | null, target: Node | EventTarget | null): boolean {
  if (!target || !('nodeType' in target)) {
    return false;
  }
  const portal = findUpUntil(
    target as HTMLElement,
    node => node === container || ('dataset' in node && !!node.dataset.awsuiReferrerId)
  );
  if (portal && portal === container) {
    // We found the container as a direct ancestor without a portal
    return true;
  }
  const referrer = portal && 'dataset' in portal ? document.getElementById(portal.dataset.awsuiReferrerId ?? '') : null;
  return referrer ? nodeContains(container, referrer) : nodeContains(container, target);
}
