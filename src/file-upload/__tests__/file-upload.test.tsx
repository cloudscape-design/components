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
// TODO: ensure coverage

const defaultProps: FileUploadProps = {
  buttonText: 'Choose file',
  value: [],
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
    expect(render({ disabled: false }).isDisabled()).toBe(false);
    expect(render({ disabled: false }).findUploadButton().getElement()).not.toBeDisabled();
    expect(render({ disabled: false }).findNativeInput().getElement()).not.toBeDisabled();

    expect(render({ disabled: true }).isDisabled()).toBe(true);
    expect(render({ disabled: true }).findUploadButton().getElement()).toBeDisabled();
    expect(render({ disabled: true }).findNativeInput().getElement()).toBeDisabled();
  });

  test('`invalid` property is assigned', () => {
    expect(render({ invalid: false }).findUploadButton().getElement()).not.toBeInvalid();
    expect(render({ invalid: true }).findUploadButton().getElement()).toBeInvalid();
  });
});

describe('File upload single file token rendering', () => {
  test('file token is not found when no file specified', () => {
    //
  });

  test('when multiple files provided only the first one is rendered', () => {
    //
  });

  test('dev warning is issued when using multiple files with a singular file upload', () => {
    //
  });

  test('selected file remove token has ARIA label set', () => {
    //
  });

  test('selected file can be removed', () => {
    //
  });

  test('selected file has all metadata', () => {
    //
  });

  test('selected file size can be customized', () => {
    //
  });

  test('selected file last update timestamp can be customized', () => {
    //
  });

  test('thumbnail is not shown for a singular file upload and a dev warning is issued', () => {
    //
  });
});

describe('File upload multiple file tokens rendering', () => {
  test('file tokens are not found when no files specified', () => {
    //
  });
});

describe('File upload inline editing', () => {
  test('ARIA labels of all inline editing controls are set', () => {
    //
  });

  test('File name in a singular file upload can be edited', () => {
    // or discarded!
  });

  test('File name in a multiple file upload can be edited', () => {
    // or discarded!
  });
});
