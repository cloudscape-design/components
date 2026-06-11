// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useEffect, useState } from 'react';

export function useAsyncData<T = unknown>(loadCallback: () => Promise<T[]>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let rendered = true;
    loadCallback().then(items => {
      if (rendered) {
        setItems(items as T[]);
        setLoading(false);
      }
    });
    return () => {
      rendered = false;
    };
    /**
     * Note: The `loadCallback` is not required to be memoized with `useCallback`.
     * Adding it as a dependency may cause unintended behavior, such as re-triggering
     * the data load on every render.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [items, loading] as const;
}
