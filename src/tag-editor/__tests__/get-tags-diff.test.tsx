// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { clearMessageCache } from '@cloudscape-design/component-toolkit/internal';

import { getTagsDiff, TagEditorProps } from '../../../lib/components/tag-editor';

describe('identifyTagStates', () => {
  const initialTags: TagEditorProps.Tag[] = [
    { key: 'tag1', value: 'value1', existing: true },
    { key: 'tag2', value: 'value2', existing: true },
    { key: 'tag3', value: 'value3', existing: true },
  ];

  test('should return created tags when all tags are created', () => {
    const newTags: TagEditorProps.Tag[] = [
      { key: 'tag1', value: 'value1', existing: false },
      { key: 'tag3', value: 'value3', existing: false },
      { key: 'tag4', value: 'value4', existing: false },
    ];

    const result = getTagsDiff([], newTags);
    expect(result.created).toEqual({
      tag1: 'value1',
      tag3: 'value3',
      tag4: 'value4',
    });
    expect(result.removed).toEqual([]);
  });
  test('should return empty created and removed fields if tags and initial tags are equal', () => {
    const result = getTagsDiff(initialTags, initialTags);
    expect(result.created).toEqual({});
    expect(result.removed).toEqual([]);
  });
  test('should return removed tags only when all tags are removed', () => {
    const removedTags: TagEditorProps.Tag[] = [
      { key: 'tag1', value: 'value1', existing: true, markedForRemoval: true },
      { key: 'tag3', value: 'value3', existing: true, markedForRemoval: true },
      { key: 'tag4', value: 'value4', existing: true, markedForRemoval: true },
    ];

    const result = getTagsDiff(initialTags, removedTags);
    expect(result.created).toEqual({});
    expect(result.removed).toEqual(['tag1', 'tag3', 'tag4']);
  });

  test('should handle mixed created, removed, and updated tags', () => {
    const newTags: TagEditorProps.Tag[] = [
      { key: 'tag1', value: 'new-value1', existing: true },
      { key: 'tag3', value: 'value3', existing: true, markedForRemoval: true },
      { key: 'tag4', value: 'value4', existing: false },
    ];

    const result = getTagsDiff(initialTags, newTags);

    expect(result.created).toEqual({
      tag4: 'value4',
      tag1: 'new-value1',
    });
    expect(result.removed).toEqual(['tag3', 'tag1']);
  });

  test('should return empty arrays if no changes are detected', () => {
    const result = getTagsDiff(initialTags, initialTags);

    expect(result.created).toEqual({});
    expect(result.removed).toEqual([]);
  });

  describe('warnings', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation();
    });
    afterEach(() => {
      clearMessageCache();
      jest.restoreAllMocks();
    });

    test('should warn if initial tags are missing the `existing` property', () => {
      const invalidInitialTags: TagEditorProps.Tag[] = [{ key: 'tag1', value: 'value1', existing: false }];

      getTagsDiff(invalidInitialTags, initialTags);

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('all initial tags should have `existing` property set to `true`.')
      );
    });
    test('should warn if initial tags are not unique', () => {
      const invalidInitialTags: TagEditorProps.Tag[] = [
        { key: 'tag1', value: 'value1', existing: true },
        {
          key: 'tag1',
          value: 'value2',
          existing: true,
        },
      ];

      getTagsDiff(invalidInitialTags, initialTags);

      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('tags should not have duplicate keys.'));
    });
  });
});
