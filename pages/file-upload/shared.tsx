// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FileUploadProps } from '~components';

export const i18nStrings: FileUploadProps.I18nStrings = {
  uploadButtonText: (multiple: boolean) => (multiple ? 'Choose files' : 'Choose file'),
  dropzoneText: (multiple: boolean) => (multiple ? 'Drop files to upload' : 'Drop file to upload'),
  removeFileAriaLabel: (fileIndex: number) => `Remove file ${fileIndex + 1}`,
  limitShowFewer: 'Show fewer files',
  limitShowMore: 'Show more files',
  errorIconAriaLabel: 'Error',
  warningIconAriaLabel: 'Warning',
};
