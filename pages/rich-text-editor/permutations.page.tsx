// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import RichTextEditor, { RichTextEditorProps } from '~components/rich-text-editor';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<RichTextEditorProps>([
  {
    value: ['', '<p>Formatted <b>bold</b> and <i>italic</i> text.</p>'],
    placeholder: ['Enter formatted text'],
    disabled: [false, true],
  },
  {
    value: ['<ul><li>One</li><li>Two</li></ul>'],
    readOnly: [false, true],
  },
  {
    value: ['<p>Invalid state</p>'],
    invalid: [true],
  },
  {
    value: ['<p>Custom toolbar</p>'],
    toolbarControls: [['bold', 'italic', 'link']],
  },
]);

export default function RichTextEditorPermutations() {
  return (
    <>
      <h1>Rich text editor permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => <RichTextEditor ariaLabel="Rich text editor" onChange={() => {}} {...permutation} />}
        />
      </ScreenshotArea>
    </>
  );
}
