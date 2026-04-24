// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Resolves the portal container to the ownerDocument.body of the referenced element.
 * Ensures portaled content renders in the correct document context (e.g. inside iframes).
 */
export function usePortalContainer(getElement: () => HTMLElement | SVGElement | null | undefined): HTMLElement | null {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const getElementRef = useRef(getElement);
  getElementRef.current = getElement;

  useLayoutEffect(() => {
    setContainer(getElementRef.current()?.ownerDocument?.body ?? document.body);
  }, []);

  return container;
}
