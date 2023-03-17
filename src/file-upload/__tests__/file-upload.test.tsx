// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render as testingLibraryRender, screen } from '@testing-library/react';
import FileUpload, { FileUploadProps } from '../../../lib/components/file-upload';
import createWrapper from '../../../lib/components/test-utils/dom';
import { warnOnce } from '../../../lib/components/internal/logging';
import '../../__a11y__/to-validate-a11y';
import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';

jest.mock('../../../lib/components/internal/logging', () => ({
  warnOnce: jest.fn(),
}));
jest.mock('../../../lib/components/internal/utils/date-time', () => ({
  formatDateTime: () => '2020-06-01T00:00:00',
}));

const onChange = jest.fn();

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
  onChange.mockReset();
});

const defaultProps: FileUploadProps = {
  buttonText: 'Choose file',
  value: [],
  onChange,
  i18nStrings: {
    removeFileAriaLabel: 'Remove file',
    activateFileNameEditAriaLabel: 'Edit file name',
    submitFileNameEditAriaLabel: 'Submit file name edit',
    cancelFileNameEditAriaLabel: 'Cancel file name edit',
    editFileNameInputAriaLabel: 'File name input',
  },
};

const file1 = new File([new Blob(['Test content 1'], { type: 'text/plain' })], 'test-file-1.txt', {
  type: 'text/plain',
  lastModified: 1590962400000,
});
const file2 = new File([new Blob(['Test content 2'], { type: 'text/plain' })], 'test-file-2.txt', {
  type: 'image/png',
  lastModified: 1590962400000,
});

function render(props: Partial<FileUploadProps>) {
  const renderResult = testingLibraryRender(
    <div>
      <FileUpload {...{ ...defaultProps, ...props }} />
      <div id="test-label">Test label</div>
    </div>
  );
  return createWrapper(renderResult.container).findFileUpload()!;
}

describe('FileUpload input', () => {
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

  test('dev warning is issued when `onChange` handler is missing', () => {
    render({ onChange: undefined });

    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith(
      'FileUpload',
      'You provided `value` prop without an `onChange` handler. This will render a read-only component. If the component should be mutable, set an `onChange` handler.'
    );
  });
});

describe('File upload tokens', () => {
  test('when multiple=true all file tokens are shown', () => {
    const wrapper = render({ multiple: true, value: [file1, file2] });

    expect(wrapper.findFileTokens()).toHaveLength(2);

    expect(wrapper.findFileTokens()[0].getElement()).toHaveTextContent('test-file-1.txt');
    expect(wrapper.findFileToken(1)!.getElement()).toHaveTextContent('test-file-1.txt');

    expect(wrapper.findFileTokens()[1].getElement()).toHaveTextContent('test-file-2.txt');
    expect(wrapper.findFileToken(2)!.getElement()).toHaveTextContent('test-file-2.txt');
  });

  test('when multiple=false only the first token is shown', () => {
    const wrapper = render({ value: [file1, file2] });

    expect(wrapper.findFileTokens()).toHaveLength(1);

    expect(wrapper.findFileTokens()[0].getElement()).toHaveTextContent('test-file-1.txt');
    expect(wrapper.findFileToken(1)!.getElement()).toHaveTextContent('test-file-1.txt');
  });

  test('dev warning is issued when using multiple files with a singular file upload', () => {
    render({ value: [file1, file2] });

    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith('FileUpload', 'Value must be an array of size 0 or 1 when `multiple=false`.');
  });

  test('files tokens are disabled if file upload is disabled', () => {
    const wrapperSingular = render({ disabled: true, value: [file1] });
    expect(wrapperSingular.findFileToken(1)!.getElement()).toHaveAttribute('aria-disabled');

    const wrapperMultiple = render({ disabled: true, multiple: true, value: [file1] });
    expect(wrapperMultiple.findFileToken(1)!.getElement()).toHaveAttribute('aria-disabled');
  });

  test('file token remove button has ARIA label set', () => {
    const wrapper = render({ value: [file1] });
    expect(wrapper.findFileToken(1)!.findRemoveButton()!.getElement()).toHaveAccessibleName('Remove file');
  });

  test('selected file can be removed', () => {
    const wrapperSingular = render({ value: [file1] });
    wrapperSingular.findFileToken(1)!.findRemoveButton()!.click();

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: [] } }));

    const wrapperMultiple = render({ multiple: true, value: [file1, file2] });
    wrapperMultiple.findFileToken(1)!.findRemoveButton()!.click();

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { value: expect.arrayContaining([file2]) } })
    );
  });

  test('file token only shows name by default', () => {
    const wrapper = render({ value: [file1] });

    expect(wrapper.findFileToken(1)!.findFileName().getElement()).toHaveTextContent('test-file-1.txt');
    expect(wrapper.findFileToken(1)!.findFileType()).toBe(null);
    expect(wrapper.findFileToken(1)!.findFileSize()).toBe(null);
    expect(wrapper.findFileToken(1)!.findFileLastModified()).toBe(null);
    expect(wrapper.findFileToken(1)!.findFileThumbnail()).toBe(null);
  });

  test.each([false, true])('file token metadata can be selected for multiple=%s', multiple => {
    const wrapper = render({
      multiple,
      value: [file1],
      showFileType: true,
      showFileSize: true,
      showFileLastModified: true,
    });
    expect(wrapper.findFileToken(1)!.findFileName().getElement()).toHaveTextContent('test-file-1.txt');
    expect(wrapper.findFileToken(1)!.findFileType()!.getElement()).toHaveTextContent('text/plain');
    expect(wrapper.findFileToken(1)!.findFileSize()!.getElement()).toHaveTextContent('0.01 KB');
    expect(wrapper.findFileToken(1)!.findFileLastModified()!.getElement()).toHaveTextContent('2020-06-01T00:00:00');
  });

  test('thumbnail is only shown  when file type starts with "image"', () => {
    expect(
      render({ value: [file1], showFileThumbnail: true })
        .findFileToken(1)!
        .findFileThumbnail()
    ).toBe(null);

    expect(
      render({ value: [file2], showFileThumbnail: true })
        .findFileToken(1)!
        .findFileThumbnail()
    ).not.toBe(null);
  });

  test('selected file size can be customized', () => {
    const wrapper = render({
      value: [file1],
      showFileSize: true,
      i18nStrings: {
        ...defaultProps.i18nStrings,
        formatFileSize: sizeInBytes => `${sizeInBytes} bytes`,
      },
    });
    expect(wrapper.findFileToken(1)!.findFileSize()!.getElement()).toHaveTextContent('14 bytes');
  });

  test('selected file last update timestamp can be customized', () => {
    const wrapper = render({
      value: [file1],
      showFileLastModified: true,
      i18nStrings: {
        ...defaultProps.i18nStrings,
        formatFileTimestamp: date => `${date.getFullYear()} year`,
      },
    });
    expect(wrapper.findFileToken(1)!.findFileLastModified()!.getElement()).toHaveTextContent('2020 year');
  });
});

describe('File upload inline editing', () => {
  test('ARIA labels of all inline editing controls are set', () => {
    const fileToken = render({ value: [file1] }).findFileToken(1)!;

    expect(fileToken.isNameEditingActive()).toBe(false);
    expect(fileToken.findActivateNameEditButton()!.getElement()).toHaveAccessibleName('Edit file name');

    fileToken.findActivateNameEditButton()!.click();

    expect(fileToken.isNameEditingActive()).toBe(true);
    expect(fileToken.findNameEditInput()!.findNativeInput().getElement()).toHaveAccessibleName('File name input');
    expect(fileToken.findSubmitNameEditButton()!.getElement()).toHaveAccessibleName('Submit file name edit');
    expect(fileToken.findCancelNameEditButton()!.getElement()).toHaveAccessibleName('Cancel file name edit');
  });

  test('File name can be edited', () => {
    const fileToken = render({ value: [file1] }).findFileToken(1)!;

    fileToken.findActivateNameEditButton()!.click();
    fileToken.findNameEditInput()!.setInputValue('updated-file-1.txt');
    fileToken.findSubmitNameEditButton()!.click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { value: expect.arrayContaining([expect.objectContaining({ name: 'updated-file-1.txt' })]) },
      })
    );
  });

  test('File name edit can be discarded with a cancel button', () => {
    const fileToken = render({ value: [file1] }).findFileToken(1)!;

    fileToken.findActivateNameEditButton()!.click();
    fileToken.findNameEditInput()!.setInputValue('updated-file-1.txt');
    fileToken.findCancelNameEditButton()!.click();

    expect(fileToken.isNameEditingActive()).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  test('File name edit can be discarded with an Escape keypress', () => {
    const fileToken = render({ value: [file1] }).findFileToken(1)!;

    fileToken.findActivateNameEditButton()!.click();
    fileToken.findNameEditInput()!.setInputValue('updated-file-1.txt');
    fileToken.findNameEditInput()!.findNativeInput().keydown(KeyCode.escape);

    expect(fileToken.isNameEditingActive()).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(0);
  });
});

test('a11y', async () => {
  const wrapper = render({
    multiple: true,
    value: [file1, file2],
    showFileType: true,
    showFileSize: true,
    showFileLastModified: true,
  });
  await expect(wrapper.getElement()).toValidateA11y();

  wrapper.findFileToken(1)!.findActivateNameEditButton()!.click();
  await expect(wrapper.getElement()).toValidateA11y();
});
