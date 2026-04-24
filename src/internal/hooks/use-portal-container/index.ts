// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Resolves the portal container to the ownerDocument.body of the referenced element.
 * Ensures portaled content renders in the correct document context (e.g. inside iframes).
 */
export function usePortalContainer(getElement: () => HTMLElement | SVGElement | null | undefined): HTMLElement {
  return getElement()?.ownerDocument?.body ?? document.body;
}
