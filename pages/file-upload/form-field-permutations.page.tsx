// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import FileUpload, { FileUploadProps } from '~components/file-upload';

const permutations = createPermutations<FileUploadProps>([
  {
    label: ['Profile image'],
    description: ['Upload your photo'],
    constraintText: ['File size must not exceed 1MB'],
    buttonText: ['Choose file'],
    value: [new File([new Blob(['demo content 1'], { type: 'text/plain' })], 'demo file 1')],
    fileMetadata: [
      { name: true, type: true, size: 'KB', lastModified: true, lastModifiedLocale: 'de-DE', thumbnail: true },
    ],
    errorText: [null, 'File is too large'],
  },
  {
    multiple: [true],
    label: ['Profile image'],
    description: ['Upload your photo'],
    constraintText: ['File size must not exceed 1MB'],
    buttonText: ['Choose file'],
    value: [
      [
        new File([new Blob(['demo content 1'], { type: 'text/plain' })], 'demo file 1'),
        new File([new Blob(['demo content 2'], { type: 'text/plain' })], 'demo file 2'),
      ],
    ],
    fileMetadata: [
      { name: true, type: true, size: 'KB', lastModified: true, lastModifiedLocale: 'de-DE', thumbnail: true },
    ],
    errorText: [null, 'Files are too large'],
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
