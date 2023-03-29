// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FileUploadServer } from './form-helpers';
import { FilesUploadState } from './utils';

export class DummyServer implements FileUploadServer {
  private files: File[] = [];
  private state = new FilesUploadState(0);
  private timeout: null | ReturnType<typeof setTimeout> = null;

  public imitateServerError = false;
  public imitateServerFileError = false;

  upload(files: File[], onProgress: (state: FilesUploadState) => void, onFinished: (state: FilesUploadState) => void) {
    this.files = files;
    this.state = new FilesUploadState(files.length);

    let tick = 0;
    const totalSizeInBytes = files.reduce((sum, file) => sum + file.size, 0);
    const speedInBytes = totalSizeInBytes / 100;

    const upload = () => {
      tick += 1;

      setTimeout(() => {
        const progressIndex = this.state.progress.findIndex(p => p !== 100);
        if (progressIndex === -1) {
          onFinished(this.state.clone());
          return;
        }
        const fileToUpload = this.files[progressIndex];

        // Emulate errors.
        if (this.imitateServerError && !this.imitateServerFileError) {
          this.state.addError('502: Cannot connect to the sever');
          onProgress(this.state.clone());
          onFinished(this.state.clone());
          return;
        }
        if (tick === 100 && this.imitateServerError) {
          this.state.addError('500: Internal server error');
        }
        if (tick === 100 && this.imitateServerFileError) {
          this.state.addFileError(progressIndex, 'File is not accepted by server');
        }

        const nextFileProgressInBytes = (fileToUpload.size * this.state.progress[progressIndex]) / 100 + speedInBytes;
        const nextFileProgress = Math.min(100, 100 * (nextFileProgressInBytes / fileToUpload.size));
        this.state.setProgress(progressIndex, nextFileProgress);
        onProgress(this.state.clone());
        upload();
      }, 25);
    };

    upload();
  }

  cancel() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
