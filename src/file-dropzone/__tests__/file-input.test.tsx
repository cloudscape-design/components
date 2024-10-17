// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render as testingLibraryRender, screen } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import '../../__a11y__/to-validate-a11y';
import FileInput, { FileInputProps } from '../../../lib/components/file-input';
import createWrapper from '../../../lib/components/test-utils/dom';

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

const defaultProps: FileInputProps = {
  value: [],
  onChange,
  i18nStrings: {
    uploadButtonText: multiple => (multiple ? 'Choose files' : 'Choose file'),
  },
};

function render(props: Partial<FileInputProps>) {
  const renderResult = testingLibraryRender(
    <div>
      <FileInput {...{ ...defaultProps, ...props }} />
      <div id="test-label">Test label</div>
    </div>
  );
  return createWrapper(renderResult.container).findFileInput()!;
}

describe('FileInput input', () => {
  test('`multiple` property is assigned', () => {
    render({ multiple: false });
    screen.debug();
    expect(render({ multiple: false }).findNativeInput().getElement()).not.toHaveAttribute('multiple');
    expect(render({ multiple: true }).findNativeInput().getElement()).toHaveAttribute('multiple');
  });

  test('`accept` property is assigned', () => {
    expect(render({ accept: 'custom' }).findNativeInput().getElement()).toHaveAttribute('accept', 'custom');
  });

  test('`uploadButtonText` property is assigned', () => {
    expect(render({}).findTrigger().getElement()).toHaveTextContent('Choose file');
    expect(render({ multiple: true }).findTrigger().getElement()).toHaveTextContent('Choose files');
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
      'FileInput',
      'You provided `value` prop without an `onChange` handler. This will render a read-only component. If the component should be mutable, set an `onChange` handler.'
    );
  });

  test('file upload button can be assigned aria-invalid', () => {
    const wrapper = render({ invalid: true });
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-invalid', 'true');
  });

  test('file input fires onChange with files in details', () => {
    const wrapper = render({ multiple: true });
    fireEvent(wrapper.findNativeInput().getElement(), new CustomEvent('change', { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: [] } }));
  });
});

describe('a11y', () => {
  const file1 = new File([new Blob(['Test content 1'], { type: 'text/plain' })], 'test-file-1.txt', {
    type: 'text/plain',
    lastModified: 1590962400000,
  });
  const file2 = new File([new Blob(['Test content 2'], { type: 'text/plain' })], 'test-file-2.txt', {
    type: 'image/png',
    lastModified: 1590962400000,
  });

  test('multiple empty', async () => {
    const wrapper = render({ multiple: true, value: [] });
    await expect(wrapper.getElement()).toValidateA11y();
  });

  test('single', async () => {
    const wrapper = render({
      value: [file1],
    });
    await expect(wrapper.getElement()).toValidateA11y();
  });

  test('multiple', async () => {
    const wrapper = render({
      multiple: true,
      value: [file1, file2],
    });
    await expect(wrapper.getElement()).toValidateA11y();
  });
});
