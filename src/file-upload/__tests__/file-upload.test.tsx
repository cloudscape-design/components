// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render as testingLibraryRender, screen } from '@testing-library/react';
import FileUpload, { FileUploadProps } from '../../../lib/components/file-upload';
import createWrapper from '../../../lib/components/test-utils/dom';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import tokenListSelectors from '../../../lib/components/internal/components/token-list/styles.selectors.js';
import '../../__a11y__/to-validate-a11y';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
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
    removeFileAriaLabel: fileIndex => `Remove file ${fileIndex + 1}`,
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

function renderStateful(props: Partial<FileUploadProps> = {}) {
  const { container } = testingLibraryRender(<StatefulFileUpload {...props} />);
  return createWrapper(container).findFileUpload()!;
}

function StatefulFileUpload({ value: initialValue = [], ...rest }: Partial<FileUploadProps>) {
  const [value, setValue] = useState(initialValue);
  return <FileUpload {...defaultProps} {...rest} value={value} onChange={event => setValue(event.detail.value)} />;
}

describe('FileUpload input', () => {
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
    expect(render({ ariaRequired: false }).findNativeInput().getElement()).not.toHaveAttribute('aria-required');
    expect(render({ ariaRequired: true }).findNativeInput().getElement()).toHaveAttribute('aria-required');
  });

  test('`ariaLabelledby` property is assigned', () => {
    render({ ariaLabelledby: 'test-label' });
    expect(screen.getByLabelText('Test label')).toBeDefined();
  });

  test('`ariaLabelledby` is joined with `uploadButtonText`', () => {
    const wrapper = render({ ariaLabelledby: 'test-label' });
    expect(wrapper.findNativeInput().getElement()).toHaveAccessibleName('Test label Choose file');
  });

  test('`ariaDescribedby` property is assigned', () => {
    const uploadButton = render({ ariaDescribedby: 'test-label' }).findNativeInput().getElement();
    expect(uploadButton).toHaveAccessibleDescription('Test label');
  });

  test('`invalid` property is assigned', () => {
    expect(render({ invalid: false }).findNativeInput().getElement()).not.toBeInvalid();
    expect(render({ invalid: true }).findNativeInput().getElement()).toBeInvalid();
  });

  test('dev warning is issued when `onChange` handler is missing', () => {
    render({ onChange: undefined });

    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith(
      'FileUpload',
      'You provided `value` prop without an `onChange` handler. This will render a read-only component. If the component should be mutable, set an `onChange` handler.'
    );
  });

  test('error text is set and associated with the upload button', () => {
    const wrapper = render({ errorText: 'Error text' });
    expect(wrapper.findError()!.getElement()).toHaveTextContent('Error text');
    expect(wrapper.findNativeInput().getElement()).toHaveAccessibleDescription('Error text');
  });

  test('constraint text is set and associated with the upload button', () => {
    const wrapper = render({ constraintText: 'Constraint text' });
    expect(wrapper.findConstraint()!.getElement()).toHaveTextContent('Constraint text');
    expect(wrapper.findNativeInput().getElement()).toHaveAccessibleDescription('Constraint text');
  });

  test('error and constraint text are both associated with the upload button', () => {
    const wrapper = render({ constraintText: 'Constraint text', errorText: 'Error text' });
    expect(wrapper.findNativeInput().getElement()).toHaveAccessibleDescription('Error text Constraint text');
  });

  test('file upload button can be assigned aria-invalid', () => {
    const wrapper = render({ invalid: true });
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-invalid', 'true');
  });

  test('file upload button is assigned aria-invalid when error text is present', () => {
    const wrapper = render({ invalid: false, errorText: 'Error text' });
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-invalid', 'true');
  });

  test('file upload button is assigned aria-invalid when at least one file error is present', () => {
    const wrapperEmptyErrors = render({ invalid: false, fileErrors: [null, null, null] });
    expect(wrapperEmptyErrors.findNativeInput().getElement()).not.toHaveAttribute('aria-invalid');

    const wrapperWithFileError = render({ invalid: false, fileErrors: [null, 'File error', null] });
    expect(wrapperWithFileError.findNativeInput().getElement()).toHaveAttribute('aria-invalid', 'true');
  });

  test('file input fires onChange with files in details', () => {
    const wrapper = render({ multiple: true });
    fireEvent(wrapper.findNativeInput().getElement(), new CustomEvent('change', { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: [] } }));
  });
});

describe('File upload tokens', () => {
  test('token list is not rendered when `multiple=false`', () => {
    const wrapper = render({ multiple: false, value: [file1] });
    expect(wrapper.find(tokenListSelectors.root)).toBeNull();
  });

  test(`when multiple=true all file tokens are shown`, () => {
    const wrapper = render({ multiple: true, value: [file1, file2] });

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

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: [file2] } }));
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

  test('file tokens have aria labels set to file names', () => {
    const wrapper = render({ multiple: true, value: [file1, file2] });
    expect(wrapper.findFileToken(1)!.getElement()).toHaveAttribute('aria-label', file1.name);
    expect(wrapper.findFileToken(2)!.getElement()).toHaveAttribute('aria-label', file2.name);
  });

  test('file errors are associated to file tokens', () => {
    const wrapper = render({ multiple: true, value: [file1, file2], fileErrors: ['Error 1', 'Error 2'] });
    expect(wrapper.findFileToken(1)!.getElement()).toHaveAccessibleDescription('Error 1');
    expect(wrapper.findFileToken(2)!.getElement()).toHaveAccessibleDescription('Error 2');
  });
});

describe('Focusing behavior', () => {
  test.each([1, 2])(
    `Focus is dispatched to the next token when the token before it is removed, tokenLimit=%s`,
    tokenLimit => {
      const wrapper = renderStateful({ multiple: true, value: [file1, file2], tokenLimit });
      wrapper.findFileToken(1)!.findRemoveButton().click();

      expect(wrapper.findFileToken(1)!.findRemoveButton().getElement()).toHaveFocus();
    }
  );

  test('Focus is dispatched to the previous token when removing the token at the end', () => {
    const wrapper = renderStateful({ multiple: true, value: [file1, file2] });
    wrapper.findFileToken(2)!.findRemoveButton().click();

    expect(wrapper.findFileToken(1)!.findRemoveButton().getElement()).toHaveFocus();
  });

  test.each([false, true])(
    'Focus is dispatched to the file input when the last token is removed, multiple=%s',
    multiple => {
      const wrapper = renderStateful({ multiple, value: [file1] });
      wrapper.findFileToken(1)!.findRemoveButton().click();

      expect(wrapper.findNativeInput().getElement()).toHaveFocus();
    }
  );
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
