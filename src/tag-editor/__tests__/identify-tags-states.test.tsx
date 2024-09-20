// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { TagEditorProps } from '../../../lib/components/tag-editor';
import { identifyTagStates } from '../utils';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  warnOnce: jest.fn(),
}));

describe('getTagsChangeSet', () => {
  const initialTags: TagEditorProps.Tag[] = [
    { key: 'tag1', value: 'value1', existing: true },
    { key: 'tag2', value: 'value2', existing: true },
    { key: 'tag3', value: 'value3', existing: true },
  ];

  it('should return created tags', () => {
    const newTags: TagEditorProps.Tag[] = [...initialTags, { key: 'tag4', value: 'value4', existing: false }];

    const result = identifyTagStates(initialTags, newTags);

    expect(result.created).toEqual([{ key: 'tag4', value: 'value4', existing: false }]);
    expect(result.removed).toEqual([]);
    expect(result.updated).toEqual([]);
  });

  it('should return removed tags', () => {
    const newTags: TagEditorProps.Tag[] = [
      { key: 'tag1', value: 'value1', existing: true },
      { key: 'tag2', value: 'value2', existing: true, markedForRemoval: true },
      { key: 'tag3', value: 'value3', existing: true },
    ];

    const result = identifyTagStates(initialTags, newTags);

    expect(result.created).toEqual([]);
    expect(result.removed).toEqual([{ key: 'tag2', value: 'value2', existing: true, markedForRemoval: true }]);
    expect(result.updated).toEqual([]);
  });

  it('should return updated tags', () => {
    const newTags: TagEditorProps.Tag[] = [
      { key: 'tag1', value: 'value1', existing: true },
      { key: 'tag2', value: 'new-value2', existing: true },
      { key: 'tag3', value: 'value3', existing: true },
    ];

    const result = identifyTagStates(initialTags, newTags);

    expect(result.created).toEqual([]);
    expect(result.removed).toEqual([]);
    expect(result.updated).toEqual([{ key: 'tag2', value: 'new-value2', existing: true }]);
  });

  it('should return created, removed, and updated tags', () => {
    const newTags: TagEditorProps.Tag[] = [
      { key: 'tag1', value: 'new-value1', existing: true },
      { key: 'tag3', value: 'value3', existing: true, markedForRemoval: true },
      { key: 'tag4', value: 'value4', existing: false },
    ];

    const result = identifyTagStates(initialTags, newTags);
    expect(result.created).toEqual([{ key: 'tag4', value: 'value4', existing: false }]);
    expect(result.removed).toEqual([{ key: 'tag3', value: 'value3', existing: true, markedForRemoval: true }]);
    expect(result.updated).toEqual([{ key: 'tag1', value: 'new-value1', existing: true }]);
  });

  it('should warn if initial tags are missing the `existing` property', () => {
    const invalidInitialTags: TagEditorProps.Tag[] = [{ key: 'tag1', value: 'value1', existing: false }];

    identifyTagStates(invalidInitialTags, initialTags);

    expect(warnOnce).toHaveBeenCalledWith(
      'identifyTagStates',
      'all initial tags should have `existing` property set to `true`.'
    );
  });

  it('should return empty arrays if no changes are detected', () => {
    const result = identifyTagStates(initialTags, initialTags);

    expect(result.created).toEqual([]);
    expect(result.removed).toEqual([]);
    expect(result.updated).toEqual([]);
  });
});
