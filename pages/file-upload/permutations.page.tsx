// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import FileUpload, { FileUploadProps } from '~components/file-upload';
import { i18nStrings } from './shared';

const permutations = createPermutations<Omit<FileUploadProps, 'dismissAriaLabel' | 'i18nStrings'>>([
  {
    value: [[]],
  },
  {
    value: [[new File([new Blob(['demo content'], { type: 'text/plain' })], 'demo file')]],
  },
  {
    multiple: [true],
    value: [
      [
        new File([new Blob(['demo content 1'], { type: 'text/plain' })], 'demo file 1'),
        new File([new Blob(['demo content 2'], { type: 'text/plain' })], 'demo file 2'),
      ],
    ],
  },
  {
    value: [[new File([new Blob(['demo content'], { type: 'text/plain' })], 'demo file')]],
    showFileSize: [true],
    showFileLastModified: [true],
    showFileThumbnail: [true],
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
              i18nStrings={i18nStrings}
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
