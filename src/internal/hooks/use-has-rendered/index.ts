// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';

/**
 * Indicates whether the component has rendered at least one frame.
 */
export function useHasRendered() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const cancelAnimationFrame = requestAnimationFrameTwice(() => setMounted(true));
    return () => cancelAnimationFrame();
  }, []);

  return mounted;
}

function requestAnimationFrameTwice(callback: () => void) {
  let handle = requestAnimationFrame(() => {
    handle = requestAnimationFrame(callback);
  });
  return () => cancelAnimationFrame(handle);
}
