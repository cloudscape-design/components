// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef } from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { TagEditorProps } from './interfaces';

/**
 * Ponyfill for Array.prototype.findIndex.
 */
export function findIndex<T>(array: ReadonlyArray<T>, condition: (t: T) => unknown): number {
  for (let i = 0; i < array.length; i++) {
    if (condition(array[i])) {
      return i;
    }
  }
  return -1;
}

function makeMemoizedArray<T>(
  prev: ReadonlyArray<T>,
  next: ReadonlyArray<T>,
  isEqual: (prev: T, next: T) => boolean
): ReadonlyArray<T> {
  for (let i = 0; i < Math.max(prev.length, next.length); i++) {
    // The next array is shorter, but all the items match.
    if (i === next.length) {
      return prev.slice(0, i);
    }
    // The prev array is shorter, but all the items so far match.
    if (i === prev.length) {
      return [...prev.slice(0, i), ...next.slice(i)];
    }
    // The item is not equal. Partition at this point.
    if (!isEqual(prev[i], next[i])) {
      return [...prev.slice(0, i), next[i], ...makeMemoizedArray(prev.slice(i + 1), next.slice(i + 1), isEqual)];
    }
  }

  // All the references match. Return the old array.
  return prev;
}

export function useMemoizedArray<T>(array: ReadonlyArray<T>, isEqual: (prev: T, next: T) => boolean): ReadonlyArray<T> {
  const ref = useRef<ReadonlyArray<T>>(array);
  const updated = makeMemoizedArray(ref.current, array, isEqual);
  useEffect(() => {
    ref.current = updated;
  }, [updated]);
  return updated;
}

interface GetTagsDiffResult {
  createdTags: Record<string, string>;
  removedTags: string[];
}

/**
 * Compares the initial tags with the current tags passed to the tag editor
 * and returns the differences, identifying which tags have been created or removed.
 *
 * This utility can be used to track tag changes and inform your tagging service about
 * the removed and added tags.
 *
 * @param initialTags - The original tags fetched from the backend or tagging service.
 * @param tags - The current tags provided to the tag editor, including any new or modified tags.
 * @returns An object containing two arrays:
 * - `createdTags`: An record of tags that are new or updated (with modified values).
 *    Each tag is represented by its `key` and `value`.
 * - `removedKeys`: An array of tag keys that were present in the initial tags but marked for removal.
 */

export function getTagsDiff(
  initialTags: readonly TagEditorProps.Tag[],
  tags: readonly TagEditorProps.Tag[]
): GetTagsDiffResult {
  if (initialTags.some(t => !t.existing)) {
    warnOnce('identifyTagStates', 'all initial tags should have `existing` property set to `true`.');
  }
  const updated = tags.filter(tag =>
    initialTags.some(({ key, value }) => {
      return !tag.markedForRemoval && tag.key === key && tag.existing && tag.value !== value;
    })
  );
  const created = [...tags.filter(tag => !tag.existing), ...updated]
    .map(({ key, value }) => ({ key, value }))
    .reduce((acc: Record<string, string>, tag) => {
      acc[tag.key] = tag.value;
      return acc;
    }, {});
  const removed = [...tags.filter(tag => tag.existing && tag.markedForRemoval), ...updated].map(t => t.key);

  return { createdTags: created, removedTags: removed };
}
