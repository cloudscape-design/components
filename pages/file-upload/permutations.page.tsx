// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import FileUpload, { FileUploadProps } from '~components/file-upload';
import { i18nStrings } from './shared';
import { Box } from '~components';

const permutations = createPermutations<Omit<FileUploadProps, 'dismissAriaLabel' | 'i18nStrings'>>([
  {
    value: [[]],
    constraintText: [null, 'File size must not exceed 1 MB'],
  },
  {
    value: [[new File([new Blob(['demo content'])], 'demo file', { type: 'image/*' })]],
    errorText: [null, 'File size is above 1 MB'],
    constraintText: ['File size must not exceed 1 MB'],
  },
  {
    multiple: [true],
    value: [
      [
        new File([new Blob(['demo content 1'])], 'demo file 1', { type: 'image/*' }),
        new File([new Blob(['demo content 2'])], 'demo file 2', { type: 'image/*' }),
      ],
    ],
    showFileSize: [true],
    showFileLastModified: [true],
    showFileThumbnail: [false, true],
    errorText: [null, 'Files have errors'],
    constraintText: ['File size must not exceed 1 MB'],
    fileErrors: [undefined, ['File size is above 1 MB', 'File size is above 1 MB']],
  },
]);

export default function FileUploadPermutations() {
  return (
    <>
      <h1>FileUpload permutations</h1>
      <ScreenshotArea>
        <Box id="file-upload-label" margin={{ bottom: 'm' }}>
          File upload label (required when using outside form-field)
        </Box>

        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <FileUpload
              ariaLabelledby="file-upload-label"
              i18nStrings={{
                ...i18nStrings,
                formatFileSize: () => `1.01 MB`,
                formatFileLastModified: () => '2020-01-01T00:00:00',
              }}
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
