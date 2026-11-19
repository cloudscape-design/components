// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';

/*
 * This hook allows setting an DOM attribute after the first render, without rerendering the component.
 */
export function useDOMAttribute(elementRef: React.RefObject<HTMLElement>, attributeName: string, value: string) {
  const attributeValueRef = useRef<string | undefined>();

  useEffect(() => {
    // With this effect, we apply the attribute only on the client, to avoid hydration errors.
    attributeValueRef.current = value;
    elementRef.current?.setAttribute(attributeName, value);
  }, [attributeName, value, elementRef]);

  return {
    [attributeName]: attributeValueRef.current,
  };
}
