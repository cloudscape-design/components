// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render as testingLibraryRender, screen } from '@testing-library/react';
import FileUpload, { FileUploadProps } from '../../../lib/components/file-upload';
import createWrapper from '../../../lib/components/test-utils/dom';
import { warnOnce } from '../../../lib/components/internal/logging';
import '../../__a11y__/to-validate-a11y';

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
  value: [],
  onChange,
  i18nStrings: {
    uploadButtonText: multiple => (multiple ? 'Choose files' : 'Choose file'),
    dropzoneText: multiple => (multiple ? 'Drag files to upload' : 'Drag file to upload'),
    removeFileAriaLabel: (_file, fileIndex) => `Remove file ${fileIndex + 1}`,
    errorIconAriaLabel: 'Error',
    limitShowFewer: 'Show fewer files',
    limitShowMore: 'Show more files',
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
  // TODO: add programmatic file upload test
  // TODO: test error text assoc
  // TODO: test constraint text assoc
  // TODO: test aria-invalid
  // TODO: test focusing

  test('`multiple` property is assigned', () => {
    expect(render({ multiple: false }).findNativeInput().getElement()).not.toHaveAttribute('multiple');
    expect(render({ multiple: true }).findNativeInput().getElement()).toHaveAttribute('multiple');
  });

  test('`accept` property is assigned', () => {
    expect(render({ accept: 'custom' }).findNativeInput().getElement()).toHaveAttribute('accept', 'custom');
  });

  test('`uploadButtonText` property is assigned', () => {
    expect(render({}).findUploadButton().getElement()).toHaveTextContent('Choose file');
    expect(render({ multiple: true }).findUploadButton().getElement()).toHaveTextContent('Choose files');
  });

  test('`ariaRequired` property is assigned', () => {
    expect(render({ ariaRequired: false }).findUploadButton().getElement()).not.toHaveAttribute('aria-required');
    expect(render({ ariaRequired: true }).findUploadButton().getElement()).toHaveAttribute('aria-required');
  });

  test('`ariaLabelledby` property is assigned', () => {
    render({ ariaLabelledby: 'test-label' });
    expect(screen.getByLabelText('Test label')).toBeDefined();
  });

  test('`ariaLabelledby` is joined with `uploadButtonText`', () => {
    const wrapper = render({ ariaLabelledby: 'test-label' });
    expect(wrapper.findUploadButton().getElement()).toHaveAccessibleName('Test label Choose file');
  });

  test('`ariaDescribedby` property is assigned', () => {
    const uploadButton = render({ ariaDescribedby: 'test-label' }).findUploadButton().getElement();
    expect(uploadButton).toHaveAccessibleDescription('Test label');
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
  // TODO: test file errors assignment and association
  // TODO: test token list vs token group!!!!
  // TODO: test token aria label and descrition

  test.each([false, true])(`when multiple=%s all file tokens are shown`, multiple => {
    const wrapper = render({ multiple, value: [file1, file2] });

    expect(wrapper.findFileTokens()).toHaveLength(2);

    expect(wrapper.findFileTokens()[0].getElement()).toHaveTextContent('test-file-1.txt');
    expect(wrapper.findFileToken(1)!.getElement()).toHaveTextContent('test-file-1.txt');

    expect(wrapper.findFileTokens()[1].getElement()).toHaveTextContent('test-file-2.txt');
    expect(wrapper.findFileToken(2)!.getElement()).toHaveTextContent('test-file-2.txt');
  });

  test('dev warning is issued when using multiple files with a singular file upload', () => {
    render({ value: [file1, file2] });

    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith('FileUpload', 'Value must be an array of size 0 or 1 when `multiple=false`.');
  });

  test('file token remove button has ARIA label set', () => {
    const wrapper = render({ value: [file1] });
    expect(wrapper.findFileToken(1)!.findRemoveButton()!.getElement()).toHaveAccessibleName('Remove file 1');
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
    expect(wrapper.findFileToken(1)!.findFileSize()).toBe(null);
    expect(wrapper.findFileToken(1)!.findFileLastModified()).toBe(null);
    expect(wrapper.findFileToken(1)!.findFileThumbnail()).toBe(null);
  });

  test('file token metadata can be opt-in', () => {
    const wrapper = render({
      value: [file1],
      showFileSize: true,
      showFileLastModified: true,
    });
    expect(wrapper.findFileToken(1)!.findFileName().getElement()).toHaveTextContent('test-file-1.txt');
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
        formatFileLastModified: date => `${date.getFullYear()} year`,
      },
    });
    expect(wrapper.findFileToken(1)!.findFileLastModified()!.getElement()).toHaveTextContent('2020 year');
  });

  test('the `tokenLimit` property controls the number of tokens shown by default', () => {
    const wrapper = render({ multiple: true, value: [file1, file2], tokenLimit: 1 });
    expect(wrapper.findFileTokens()).toHaveLength(1);
    expect(wrapper.getElement().textContent).toContain('Show more files');
  });
});

describe('a11y', () => {
  test('multiple empty', async () => {
    const wrapper = render({ multiple: true, value: [] });
    await expect(wrapper.getElement()).toValidateA11y();
  });

  test('multiple empty w/ constraint and error', async () => {
    const wrapper = render({ multiple: true, value: [], constraintText: 'Constraint', errorText: 'Error' });
    await expect(wrapper.getElement()).toValidateA11y();
  });

  test('single w/o errors', async () => {
    const wrapper = render({
      value: [file1],
      showFileSize: true,
      showFileLastModified: true,
      constraintText: 'Constraint',
    });
    await expect(wrapper.getElement()).toValidateA11y();
  });

  test('single w/ errors', async () => {
    const wrapper = render({
      value: [file1],
      showFileSize: true,
      showFileLastModified: true,
      constraintText: 'Constraint',
      errorText: 'Error',
      fileErrors: ['File error'],
    });
    await expect(wrapper.getElement()).toValidateA11y();
  });

  test('multiple w/o errors', async () => {
    const wrapper = render({
      multiple: true,
      value: [file1, file2],
      showFileSize: true,
      showFileLastModified: true,
    });
    await expect(wrapper.getElement()).toValidateA11y();
  });

  test('multiple w/ errors', async () => {
    const wrapper = render({
      multiple: true,
      value: [file1, file2],
      showFileSize: true,
      showFileLastModified: true,
      constraintText: 'Constraint',
      errorText: '2 files have error(s)',
      fileErrors: ['File 1 error', 'File 2 error'],
    });
    await expect(wrapper.getElement()).toValidateA11y();
  });
});
