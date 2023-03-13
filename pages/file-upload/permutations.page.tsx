// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import FileUpload, { FileUploadProps } from '~components/file-upload';

const permutations = createPermutations<FileUploadProps>([
  {
    buttonText: ['Choose file (empty)'],
    value: [null],
  },
  {
    buttonText: ['Choose file (single)'],
    value: [new File([new Blob(['demo content'], { type: 'text/plain' })], 'demo file')],
    disabled: [true, false],
  },
  {
    multiple: [true],
    buttonText: ['Choose file (multiple)'],
    value: [
      [
        new File([new Blob(['demo content 1'], { type: 'text/plain' })], 'demo file 1'),
        new File([new Blob(['demo content 2'], { type: 'text/plain' })], 'demo file 2'),
      ],
    ],
    disabled: [true, false],
  },
  {
    buttonText: ['Choose file (metadata)'],
    value: [new File([new Blob(['demo content'], { type: 'text/plain' })], 'demo file')],
    fileMetadata: [
      { name: false, type: false, size: undefined, lastModified: false, thumbnail: false },
      { name: true, type: true, size: 'KB', lastModified: true, lastModifiedLocale: 'de-DE', thumbnail: true },
    ],
  },
]);

export default function FileUploadPermutations() {
  return (
    <>
      <h1>FileUpload permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <FileUpload
              onChange={() => {
                /*empty handler to suppress react controlled property warning*/
              }}
              {...permutation}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
