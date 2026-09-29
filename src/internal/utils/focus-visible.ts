// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Returns whether the current interaction is keyboard-driven, based on the shared focus-visible
 * signal maintained by `useFocusVisible` (from the component toolkit). That hook sets the
 * `data-awsui-focus-visible` attribute on the document body after a non-modifier key press and
 * removes it on a mouse down, so this reflects whether the most recent interaction was a key
 * press rather than a pointer action.
 *
 * Useful in focus handlers that need to tell a keyboard focus move (e.g. Tab) apart from a
 * focus move caused by a mouse click.
 *
 * @param element Optional element used to resolve the owning document (for iframe support).
 * Defaults to the main document.
 */
export function isKeyboardInteraction(element?: Element | null): boolean {
  const ownerDocument = element?.ownerDocument ?? document;
  return !!ownerDocument.body.dataset.awsuiFocusVisible;
}
