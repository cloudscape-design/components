// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { FileUpload, Header } from '~components';
import SpaceBetween from '~components/space-between';
import { i18nStrings } from './shared';

export default function FileUploadTestPage() {
  const [contractFiles, setContractFiles] = useState([
    new File([new Blob(['demo content 1'], { type: 'text/plain' })], 'contract-1.pdf'),
    new File([new Blob(['demo content 2'], { type: 'text/plain' })], 'contract-2.pdf'),
  ]);

  return (
    <SpaceBetween size="m">
      <Header variant="h1">File upload integration test page</Header>
      <button type="button" id="focus-target">
        focus target
      </button>
      <FileUpload
        multiple={true}
        value={contractFiles}
        onChange={event => setContractFiles(event.detail.value)}
        accept="application/pdf, image/png, image/jpeg"
        showFileSize={true}
        showFileLastModified={true}
        showFileThumbnail={true}
        i18nStrings={i18nStrings}
      />
    </SpaceBetween>
  );
}
