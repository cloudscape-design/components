// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, ColumnLayout, FileInput, SpaceBetween } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

export default function FolderModeScenario() {
  const [folderFiles, setFolderFiles] = useState<File[]>([]);
  const [filteredFolderFiles, setFilteredFolderFiles] = useState<File[]>([]);
  const [regularFiles, setRegularFiles] = useState<File[]>([]);

  return (
    <ScreenshotArea>
      <Box padding="l">
        <h1>File input - Folder mode</h1>
        <SpaceBetween size="xl">
          <ColumnLayout columns={3}>
            <div>
              <h3>Folder mode (all files)</h3>
              <FileInput mode="folder" value={folderFiles} onChange={event => setFolderFiles(event.detail.value)}>
                Choose folder
              </FileInput>
              <Box margin={{ top: 's' }}>
                <strong>Selected files ({folderFiles.length}):</strong>
                {folderFiles.map((file, index) => (
                  <div key={index}>{(file as any).webkitRelativePath || file.name}</div>
                ))}
              </Box>
            </div>

            <div>
              <h3>Folder mode (images only)</h3>
              <FileInput
                mode="folder"
                accept=".jpg,.jpeg,.png,.gif,image/*"
                value={filteredFolderFiles}
                onChange={event => setFilteredFolderFiles(event.detail.value)}
              >
                Choose folder (images)
              </FileInput>
              <Box margin={{ top: 's' }}>
                <strong>Selected files ({filteredFolderFiles.length}):</strong>
                {filteredFolderFiles.map((file, index) => (
                  <div key={index}>{(file as any).webkitRelativePath || file.name}</div>
                ))}
              </Box>
            </div>

            <div>
              <h3>Regular file mode (comparison)</h3>
              <FileInput
                mode="file"
                multiple={true}
                value={regularFiles}
                onChange={event => setRegularFiles(event.detail.value)}
              >
                Choose files
              </FileInput>
              <Box margin={{ top: 's' }}>
                <strong>Selected files ({regularFiles.length}):</strong>
                {regularFiles.map((file, index) => (
                  <div key={index}>{file.name}</div>
                ))}
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
