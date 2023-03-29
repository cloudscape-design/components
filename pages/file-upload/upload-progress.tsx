// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Button, ProgressBar, StatusIndicator } from '~components';

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
    <div
      style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', minWidth: '300px', gap: '16px' }}
    >
      <StatusIndicator type={error ? 'error' : totalProgress < 100 ? 'in-progress' : 'success'}>
        Uploaded {progress.length} / {progress.filter(p => p === 100).length}
      </StatusIndicator>

      <div style={{ flex: '1' }}>
        <ProgressBar value={totalProgress} />
      </div>

      {error && onRefresh && <Button variant="inline-icon" iconName="refresh" onClick={onRefresh} />}
    </div>
  );
}
