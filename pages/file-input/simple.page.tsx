// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, ColumnLayout, FileInput, FileInputProps } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

export default function DateInputScenario() {
  const [files, setFiles] = useState<File[]>([]);
  const [files2, setFiles2] = useState<File[]>([]);

  const ref = React.useRef<FileInputProps.Ref>(null);

  return (
    <ScreenshotArea>
      <Box padding="l">
        <h1>File input</h1>
        <button onClick={() => ref.current?.focus()}>Focus file input</button>
        <ColumnLayout columns={2}>
          <div>
            <FileInput
              multiple={true}
              ariaLabel="prompt file input"
              variant="icon"
              value={files}
              ref={ref}
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
