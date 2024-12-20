// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import FileTokenGroup, { FileTokenGroupProps } from '~components/file-token-group';
import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const file1 = new File([new Blob(['demo content 1'])], 'demo file 1', { type: 'image/*' });
const file2 = new File([new Blob(['demo content 2'])], 'demo file 2 long name here test', { type: 'image/*' });

const permutations = createPermutations<Omit<FileTokenGroupProps, 'onDismiss'>>([
  {
    items: [[{ file: file1 }]],
    showFileLastModified: [true, false],
    showFileSize: [true, false],
    alignment: ['horizontal', 'vertical'],
  },
  {
    items: [[{ file: file1 }, { file: file2, loading: true }]],
    showFileLastModified: [true, false],
    showFileSize: [true, false],
    alignment: ['horizontal', 'vertical'],
  },
  {
    items: [
      [
        { file: file1, errorText: 'Error' },
        { file: file2, warningText: 'Warning' },
      ],
    ],
    showFileLastModified: [true, false],
    showFileSize: [true, false],
    alignment: ['horizontal', 'vertical'],
    limit: [undefined, 0],
  },
]);

export default function FileTokenGroupPermutations() {
  return (
    <I18nProvider messages={[messages]} locale="en">
      <h1>FileTokenGroup permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <FileTokenGroup
              onDismiss={() => {
                /*empty handler to suppress react controlled property warning*/
              }}
              i18nStrings={{
                formatFileLastModified: () => '2020-01-01T00:00:00',
              }}
              {...permutation}
            />
          )}
        />
      </ScreenshotArea>
    </I18nProvider>
  );
}
