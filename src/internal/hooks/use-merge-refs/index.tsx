// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';

/**
 * useMergeRefs merges multiple refs into single ref callback.
 *
 * For example
 *  const mergedRef = useMergeRefs(ref1, ref2, ref3)
 *  <div ref={refs}>...</div>
 */
export function useMergeRefs(...refs: Array<React.RefCallback<any> | React.MutableRefObject<any> | null | undefined>) {
  return useMemo(() => {
    if (refs.every(ref => ref === null || ref === undefined)) {
      return null;
    }
    return (value: any) => {
      refs.forEach(ref => {
        if (typeof ref === 'function') {
          ref(value);
        } else if (ref !== null && ref !== undefined) {
          (ref as React.MutableRefObject<any>).current = value;
        }
      });
    };
    // ESLint expects an array literal which we can not provide here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
