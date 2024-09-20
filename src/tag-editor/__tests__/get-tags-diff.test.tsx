// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { TagEditorProps } from '../../../lib/components/tag-editor';
import { getTagsDiff } from '../utils';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  warnOnce: jest.fn(),
}));

describe('identifyTagStates', () => {
  const initialTags: TagEditorProps.Tag[] = [
    { key: 'tag1', value: 'value1', existing: true },
    { key: 'tag2', value: 'value2', existing: true },
    { key: 'tag3', value: 'value3', existing: true },
  ];

  it('should return created tags including updated ones', () => {
    const newTags: TagEditorProps.Tag[] = [
      { key: 'tag1', value: 'value1', existing: true },
      { key: 'tag3', value: 'value3', existing: true },
      { key: 'tag4', value: 'value4', existing: false }, // New tag
      { key: 'tag2', value: 'new-value2', existing: true }, // Updated tag
    ];

    const result = getTagsDiff(initialTags, newTags);

    expect(result.createdTags).toEqual([
      { key: 'tag4', value: 'value4' },
      { key: 'tag2', value: 'new-value2' }, // Updated tags now part of created
    ]);
    expect(result.removedKeys).toEqual(['tag2']);
  });

  it('should return removed tags including updated ones', () => {
    const newTags: TagEditorProps.Tag[] = [
      { key: 'tag1', value: 'value1', existing: true },
      { key: 'tag2', value: 'new-value2', existing: true, markedForRemoval: true }, // Removed and updated
    ];

    const result = getTagsDiff(initialTags, newTags);

    expect(result.createdTags).toEqual([]);
    expect(result.removedKeys).toEqual(['tag2']);
  });

  it('should handle mixed created, removed, and updated tags', () => {
    const newTags: TagEditorProps.Tag[] = [
      { key: 'tag1', value: 'new-value1', existing: true },
      { key: 'tag3', value: 'value3', existing: true, markedForRemoval: true },
      { key: 'tag4', value: 'value4', existing: false },
    ];

    const result = getTagsDiff(initialTags, newTags);

    expect(result.createdTags).toEqual([
      { key: 'tag4', value: 'value4' },
      { key: 'tag1', value: 'new-value1' },
    ]);
    expect(result.removedKeys).toEqual(['tag3', 'tag1']);
  });

  it('should warn if initial tags are missing the `existing` property', () => {
    const invalidInitialTags: TagEditorProps.Tag[] = [
      { key: 'tag1', value: 'value1' } as any, // Missing `existing` property
    ];

    getTagsDiff(invalidInitialTags, initialTags);

    expect(warnOnce).toHaveBeenCalledWith(
      'identifyTagStates',
      'all initial tags should have `existing` property set to `true`.'
    );
  });

  it('should return empty arrays if no changes are detected', () => {
    const result = getTagsDiff(initialTags, initialTags);

    expect(result.createdTags).toEqual([]);
    expect(result.removedKeys).toEqual([]);
  });
});
