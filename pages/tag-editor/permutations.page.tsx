// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import TagEditor, { TagEditorProps } from '~components/tag-editor';
import { I18N_STRINGS } from './shared';

const permutations = createPermutations<TagEditorProps>([
  {
    loading: [true, false],
    tags: [[]],
    i18nStrings: [I18N_STRINGS],
    keysRequest: [() => Promise.resolve([])],
    valuesRequest: [() => Promise.resolve([])],
  },
  {
    tags: [
      [
        { key: 'key-1', value: 'value-1', existing: true },
        { key: 'key-2', value: 'value-2', existing: true },
      ],
      [
        { key: 'key-1', value: 'value-1', existing: true },
        { key: 'key-2', value: 'value-2', existing: true, markedForRemoval: true },
      ],
    ],
    i18nStrings: [I18N_STRINGS],
    keysRequest: [() => Promise.resolve([])],
    valuesRequest: [() => Promise.resolve([])],
  },
  {
    tags: [
      [
        { key: 'key-1', value: 'value-1', existing: true },
        { key: 'key-2', value: 'value-2', existing: true },
        { key: 'key-3', value: 'value-3', existing: true },
      ],
    ],
    tagLimit: [3, 2],
    i18nStrings: [I18N_STRINGS],
    keysRequest: [() => Promise.resolve([])],
    valuesRequest: [() => Promise.resolve([])],
  },
]);

export default function TagEditorPermutations() {
  return (
    <>
      <h1>Tad Editor permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div>
              <TagEditor {...permutation} />
              <hr />
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
