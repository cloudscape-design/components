// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, ColumnLayout, FileInput } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

export default function DateInputScenario() {
  const [files, setFiles] = useState<File[]>([]);
  const [files2, setFiles2] = useState<File[]>([]);

  return (
    <ScreenshotArea>
      <Box padding="l">
        <h1>File input</h1>
        <ColumnLayout columns={2}>
          <div>
            <FileInput
              multiple={true}
              ariaLabel="prompt file input"
              variant="icon"
              value={files}
              onChange={event => setFiles(event.detail.value)}
            />

            {files.map((file, index) => (
              <div key={index}>{file.name}</div>
            ))}
          </div>
          <div>
            <FileInput multiple={true} value={files2} onChange={event => setFiles2(event.detail.value)}>
              Choose files
            </FileInput>

            {files2.map((file, index) => (
              <div key={index}>{file.name}</div>
            ))}
          </div>
        </ColumnLayout>
      </Box>
    </ScreenshotArea>
  );
}
