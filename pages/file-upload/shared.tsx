// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FileUploadProps } from '~components';

export const i18nStrings: FileUploadProps.I18nStrings = {
  uploadButtonText: multiple => (multiple ? 'Choose files' : 'Choose file'),
  removeFileAriaLabel: 'Remove file',
  activateFileNameEditAriaLabel: 'Edit file name',
  submitFileNameEditAriaLabel: 'Submit file name',
  cancelFileNameEditAriaLabel: 'Cancel file name edit',
  editFileNameInputAriaLabel: 'File name input',
  limitShowFewer: 'Show fewer files',
  limitShowMore: 'Show more files',
};
