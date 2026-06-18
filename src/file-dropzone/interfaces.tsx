// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { NonCancelableEventHandler } from '../internal/events';
import { BaseComponentProps } from '../types/base-component';

export interface FileDropzoneProps extends BaseComponentProps {
  /**
   * Called when the user selects new file(s), or removes a file.
   * The event `detail` contains the current value of the component.
   */
  onChange: NonCancelableEventHandler<FileDropzoneProps.ChangeDetail>;
  /**
   * Children of the Dropzone.
   */
  children: React.ReactNode;
}

export namespace FileDropzoneProps {
  export interface ChangeDetail {
    value: File[];
  }
}
