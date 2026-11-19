// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, FileInput, FileInputProps } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

export default function DateInputScenario() {
  const [files, setFiles] = useState<File[]>([]);

  const ref = React.useRef<FileInputProps.Ref>(null);

  return (
    <ScreenshotArea>
      <Box padding="l">
        <h1>File input</h1>
        <button id="focus-before">Click here</button>
        <div style={{ paddingBlock: 2000 }}>
          <FileInput ref={ref} multiple={true} value={files} onChange={event => setFiles(event.detail.value)}>
            Choose files
          </FileInput>
          <button id="focus-after">Click here</button>

          {files.map((file, index) => (
            <div key={index}>{file.name}</div>
          ))}
        </div>
      </Box>
    </ScreenshotArea>
  );
}
