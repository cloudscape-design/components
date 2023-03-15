// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import FileUpload, { FileUploadProps } from '../../../lib/components/file-upload';
import createWrapper from '../../../lib/components/test-utils/dom';

// TODO: use validate a11y
// TODO: check ARIA labels
// TODO: test all test-utils
// TODO: test form-field context integration

const defaultProps: FileUploadProps = {
  buttonText: 'Choose file',
  value: null,
  i18nStrings: {
    removeFileAriaLabel: 'Remove file',
    activateFileNameEditAriaLabel: 'Edit file name',
    submitFileNameEditAriaLabel: 'Submit file name',
    cancelFileNameEditAriaLabel: 'Cancel file name edit',
    editFileNameInputAriaLabel: 'File name input',
  },
};

function renderFileUpload(props: FileUploadProps = defaultProps) {
  const renderResult = render(<FileUpload {...props} />);
  return createWrapper(renderResult.container).findFormField()!;
}

describe('FileUpload rendering', () => {});
