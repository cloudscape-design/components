// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { nodeContains } from '@cloudscape-design/component-toolkit/dom';

import { findUpUntil, isHTMLElement, isNode } from './dom';

/**
 * Checks whether the given node (target) belongs to the container.
 * The function is similar to nodeContains but also accounts for dropdowns with expandToViewport=true.
 *
 * @param container Container node
 * @param target Node that is checked to be a descendant of the container
 */
export function nodeBelongs(container: Node | null, target: Node | EventTarget | null): boolean {
  if (!isNode(target)) {
    return false;
  }
  const portal = findUpUntil(
    target as HTMLElement,
    node => node === container || (isHTMLElement(node) && !!node.dataset.awsuiReferrerId)
  );
  if (portal && portal === container) {
    // We found the container as a direct ancestor without a portal
    return true;
  }
  const referrer = isHTMLElement(portal) ? document.getElementById(portal.dataset.awsuiReferrerId ?? '') : null;
  return referrer ? nodeContains(container, referrer) : nodeContains(container, target);
}
