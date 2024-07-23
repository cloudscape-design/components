// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

export function useObservedElement(rootElementRef: React.RefObject<HTMLElement>, selector: string) {
  const getElement = useCallback(() => {
    const document = rootElementRef.current?.ownerDocument ?? window.document;
    return document.querySelector(selector);
  }, [rootElementRef, selector]);

  const [height, setHeight] = useState(0);

  useResizeObserver(getElement, entry => setHeight(entry.borderBoxHeight));

  return height;
}
