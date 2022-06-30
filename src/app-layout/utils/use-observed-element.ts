// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useResizeObserver } from '../../internal/hooks/container-queries';
import { useCallback, useState } from 'react';

export function useObservedElement(
  selectorOrRef: string | React.MutableRefObject<HTMLElement> | (() => HTMLElement | null) | undefined
) {
  const getElement = useCallback(() => {
    if (typeof selectorOrRef === 'string') {
      return document.querySelector(selectorOrRef);
    } else if (typeof selectorOrRef === 'function') {
      return selectorOrRef() ?? null;
    } else {
      return selectorOrRef?.current ?? null;
    }
  }, [selectorOrRef]);

  const [height, setHeight] = useState(0);

  useResizeObserver(getElement, entry => setHeight(entry.borderBoxHeight));

  return height;
}
