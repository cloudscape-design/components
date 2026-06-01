// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

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

  /**
   * An object that maps the file dropzone's slots to CSS class names for custom styling.
   * Use these classes to scope `--awsui-style-*` custom properties.
   * * `root` - The file dropzone's root element.
   * @awsuiSystem core
   */
  classNames?: FileDropzoneProps.ClassNames;
}

export namespace FileDropzoneProps {
  export interface ChangeDetail {
    value: File[];
  }

  export interface ClassNames {
    root?: string;
  }
}
