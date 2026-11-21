// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { FileUpload, Header } from '~components';
import SpaceBetween from '~components/space-between';

import { i18nStrings } from './shared';

const file1 = new File([new Blob(['demo content 1'], { type: 'text/plain' })], 'contract-1.pdf');
const file2 = new File([new Blob(['demo content 2'], { type: 'text/plain' })], 'contract-2.pdf');

export default function FileUploadDisabledPage() {
  const [files, setFiles] = useState([file1, file2]);

  return (
    <SpaceBetween size="l">
      <Header variant="h1">FileUpload disabled</Header>

      <Header variant="h2">Disabled – empty value</Header>
      <FileUpload
        disabled={true}
        value={[]}
        onChange={event => setFiles(event.detail.value)}
        i18nStrings={i18nStrings}
        constraintText="File size must not exceed 1 MB"
      />

      <Header variant="h2">Disabled – with files</Header>
      <FileUpload
        disabled={true}
        multiple={true}
        value={files}
        onChange={event => setFiles(event.detail.value)}
        showFileSize={true}
        showFileLastModified={true}
        i18nStrings={i18nStrings}
        constraintText="File size must not exceed 1 MB"
      />

      <Header variant="h2">Enabled (for comparison)</Header>
      <FileUpload
        multiple={true}
        value={files}
        onChange={event => setFiles(event.detail.value)}
        showFileSize={true}
        showFileLastModified={true}
        i18nStrings={i18nStrings}
        constraintText="File size must not exceed 1 MB"
      />
    </SpaceBetween>
  );
}
