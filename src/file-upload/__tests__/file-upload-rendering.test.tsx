// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render as testingLibraryRender } from '@testing-library/react';
import FileUpload, { FileUploadProps } from '../../../lib/components/file-upload';
import createWrapper from '../../../lib/components/test-utils/dom';
import '../../__a11y__/to-validate-a11y';

// TODO: use validate a11y
// TODO: check ARIA labels
// TODO: test all test-utils
// TODO: test form-field context integration
// TODO: test default formatters
// TODO: add integ tests for happy flow to at least ensure no errors in the console

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

function render(props: Partial<FileUploadProps>) {
  const renderResult = testingLibraryRender(<FileUpload {...{ ...defaultProps, ...props }} />);
  return createWrapper(renderResult.container).findFileUpload()!;
}

describe('FileUpload input properties rendering', () => {
  test('`multiple` property is assigned', () => {
    expect(render({ multiple: false }).findNativeInput().getElement()).not.toHaveAttribute('multiple');
    expect(render({ multiple: true }).findNativeInput().getElement()).toHaveAttribute('multiple');
  });

  test('`accept` property is assigned', () => {
    expect(render({ accept: 'custom' }).findNativeInput().getElement()).toHaveAttribute('accept', 'custom');
  });

  test('`buttonText` property is assigned', () => {
    expect(render({ buttonText: 'Choose file' }).findUploadButton().getElement()).toHaveTextContent('Choose file');
  });

  test('`ariaLabel` property is assigned', () => {
    // TODO: check aria label is assigned and accessible
  });

  test('`ariaRequired` property is assigned', () => {
    // TODO: check aria required is assigned and accessible
  });

  test('`ariaLabelledby` property is assigned', () => {
    // TODO: check aria labelled is assigned and accessible
  });

  test('`ariaDescribedby` property is assigned', () => {
    // TODO: check aria described is assigned and accessible
  });

  test('`disabled` property is assigned', () => {
    // TODO: check disabled is assigned and accessible
  });

  test('`invalid` property is assigned', () => {
    // TODO: check invalid is assigned and accessible
  });
});
