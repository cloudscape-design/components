// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FileUploadProps } from '~components';

export const i18nStrings: FileUploadProps.I18nStrings = {
  uploadButtonText: multiple => (multiple ? 'Choose files' : 'Choose file'),
  dropzoneText: multiple => (multiple ? 'Drop files to upload' : 'Drop file to upload'),
  removeFileAriaLabel: fileIndex => `Remove file ${fileIndex + 1}`,
  limitShowFewer: 'Show fewer files',
  limitShowMore: 'Show more files',
  errorIconAriaLabel: 'Error',
};
