// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FileUploadServer } from './form-helpers';
import { ValidationState } from './utils';

export class DummyServer implements FileUploadServer {
  private files: File[] = [];
  private state = new ValidationState(0);
  private timeout: null | ReturnType<typeof setTimeout> = null;

  public imitateServerError = false;
  public imitateServerFileError = false;

  upload(files: File[], onFinished: (state: ValidationState) => void) {
    this.files = files;
    this.state = new ValidationState(files.length);

    const totalSizeInBytes = files.reduce((sum, file) => sum + file.size, 0);
    const speedInBytes = totalSizeInBytes / 100;
    const progress = files.map(() => 0);

    const upload = () => {
      setTimeout(() => {
        const progressIndex = progress.findIndex(p => p !== 100);
        if (progressIndex === -1) {
          onFinished(this.state.clone());
          return;
        }
        const fileToUpload = this.files[progressIndex];
        const nextFileProgressInBytes = (fileToUpload.size * progress[progressIndex]) / 100 + speedInBytes;
        const nextFileProgress = Math.min(100, 100 * (nextFileProgressInBytes / fileToUpload.size));

        // Emulate errors.
        if (this.imitateServerError) {
          this.state.addError('502: Cannot connect to the sever');
          onFinished(this.state.clone());
          return;
        }
        if (nextFileProgress === 100 && this.imitateServerFileError) {
          this.state.addFileError(progressIndex, 'File is not accepted by server');
        }

        progress[progressIndex] = nextFileProgress;
        upload();
      }, 20);
    };

    upload();
  }

  cancel() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
