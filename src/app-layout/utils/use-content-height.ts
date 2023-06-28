// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';
import { useObservedElement } from './use-observed-element';

export default function useContentHeight(headerSelector: string, footerSelector: string, disableBodyScroll?: boolean) {
  const headerHeight = useObservedElement(headerSelector);
  const footerHeight = useObservedElement(footerSelector);
  const [headerFooterHeight, setHeaderFooterHeight] = useState(0);

  // Delay applying changes in header/footer height, as applying them immediately can cause
  // ResizeOberver warnings due to the algorithm thinking that the change might have side-effects
  // further up the tree, therefore blocking notifications to prevent loops
  useEffect(() => {
    const id = requestAnimationFrame(() => setHeaderFooterHeight(headerHeight + footerHeight));
    return () => cancelAnimationFrame(id);
  }, [headerHeight, footerHeight]);

  const heightStyleValue = `calc(100vh - ${headerFooterHeight}px)`;

  return {
    headerHeight,
    footerHeight,
    contentHeightStyle: {
      [disableBodyScroll ? 'height' : 'minHeight']: heightStyleValue,
    },
  };
}
