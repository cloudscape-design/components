// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Button, ProgressBar, StatusIndicator } from '~components';
import SpaceBetween from '~components/space-between';

interface UploadProgressProps {
  files: File[];
  progress: number[];
  error: boolean;
  onRefresh?: () => void;
}

export function UploadProgress({ files, progress, error, onRefresh }: UploadProgressProps) {
  if (files.length !== progress.length) {
    throw new Error('Invariant violation: files and progress arguments must be of the same length.');
  }
  for (const fileProgress of progress) {
    if (fileProgress < 0 || fileProgress > 100) {
      throw new Error('Invariant violation: file progress cannot be less than 0 or greater than 100.');
    }
  }
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const uploadedSize = files.reduce((sum, file, index) => sum + (file.size * progress[index]) / 100, 0);
  const totalProgress = Math.round(100 * (uploadedSize / totalSize));
  return (
    <SpaceBetween direction="vertical" size="s">
      <SpaceBetween direction="horizontal" size="s">
        <StatusIndicator type={error ? 'error' : totalProgress < 100 ? 'in-progress' : 'success'}>
          Uploaded files {progress.length} / {progress.filter(p => p === 100).length}
        </StatusIndicator>

        {error && onRefresh && <Button variant="inline-icon" iconName="refresh" onClick={onRefresh} />}
      </SpaceBetween>

      <ProgressBar value={totalProgress} />
    </SpaceBetween>
  );
}
