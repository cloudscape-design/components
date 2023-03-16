// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render as testingLibraryRender, screen } from '@testing-library/react';
import FileUpload, { FileUploadProps } from '../../../lib/components/file-upload';
import createWrapper from '../../../lib/components/test-utils/dom';
import '../../__a11y__/to-validate-a11y';

// TODO: use validate a11y
// TODO: test all test-utils
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
  const renderResult = testingLibraryRender(
    <div>
      <FileUpload {...{ ...defaultProps, ...props }} />
      <div id="test-label">Test label</div>
    </div>
  );
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

  test('`ariaRequired` property is assigned', () => {
    expect(render({ ariaRequired: false }).findUploadButton().getElement()).not.toHaveAttribute('aria-required');
    expect(render({ ariaRequired: true }).findUploadButton().getElement()).toHaveAttribute('aria-required');
  });

  test('`ariaLabel` property is assigned', () => {
    render({ ariaLabel: 'Choose file button' });
    expect(screen.getByLabelText('Choose file button')).toBeDefined();
  });

  test('`ariaLabelledby` property is assigned', () => {
    render({ ariaLabelledby: 'test-label' });
    expect(screen.getByLabelText('Test label')).toBeDefined();
  });

  test('`ariaDescribedby` property is assigned', () => {
    const uploadButton = render({ ariaDescribedby: 'test-label' }).findUploadButton().getElement();
    expect(uploadButton).toHaveAccessibleDescription('Test label');
  });

  test('`disabled` property is assigned', () => {
    expect(render({ disabled: false }).findUploadButton().getElement()).not.toBeDisabled();
    expect(render({ disabled: false }).findNativeInput().getElement()).not.toBeDisabled();
    expect(render({ disabled: true }).findUploadButton().getElement()).toBeDisabled();
    expect(render({ disabled: true }).findNativeInput().getElement()).toBeDisabled();
  });

  test('`invalid` property is assigned', () => {
    expect(render({ invalid: false }).findUploadButton().getElement()).not.toBeInvalid();
    expect(render({ invalid: true }).findUploadButton().getElement()).toBeInvalid();
  });
});
