// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render as testingLibraryRender, screen } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import '../../../../__a11y__/to-validate-a11y';
import InternalFileInput, { FileInputProps } from '../../../../../lib/components/internal/components/file-input';
import FileInputWrapper from '../../../../../lib/components/test-utils/dom/internal/file-input';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

jest.mock('../../../../../lib/components/internal/utils/date-time', () => ({
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
};

const file1 = new File([new Blob(['Test content 1'], { type: 'text/plain' })], 'test-file-1.txt', {
  type: 'text/plain',
  lastModified: 1590962400000,
});
const file2 = new File([new Blob(['Test content 2'], { type: 'text/plain' })], 'test-file-2.txt', {
  type: 'image/png',
  lastModified: 1590962400000,
});

function render(props: Partial<FileInputProps>) {
  const renderResult = testingLibraryRender(
    <div>
      <InternalFileInput {...{ ...defaultProps, ...props }}>Choose files</InternalFileInput>
      <div id="test-label">Test label</div>
    </div>
  );
  const element = renderResult.container.querySelector<HTMLElement>(`.${FileInputWrapper.rootSelector}`)!;
  return new FileInputWrapper(element)!;
}

describe('FileInput input', () => {
  test('`multiple` property is assigned', () => {
    render({ multiple: false });
    expect(render({ multiple: false }).findNativeInput().getElement()).not.toHaveAttribute('multiple');
    expect(render({ multiple: true }).findNativeInput().getElement()).toHaveAttribute('multiple');
  });

  test('`accept` property is assigned', () => {
    expect(render({ accept: 'custom' }).findNativeInput().getElement()).toHaveAttribute('accept', 'custom');
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
    expect(wrapper.findNativeInput().getElement()).toHaveAccessibleName('Test label Choose files');
  });

  test('`ariaDescribedby` property is assigned', () => {
    const uploadButton = render({ ariaDescribedby: 'test-label' }).findNativeInput().getElement();
    expect(uploadButton).toHaveAccessibleDescription('Test label');
  });

  test('`invalid` property is assigned', () => {
    expect(render({ invalid: false }).findNativeInput().getElement()).not.toBeInvalid();
    expect(render({ invalid: true }).findNativeInput().getElement()).toBeInvalid();
  });

  test('`text` property is assigned', () => {
    expect(render({}).findTrigger().getElement()).toHaveTextContent('Choose files');
  });

  test('uses `text` as aria label when `ariaLabel` is undefined', () => {
    expect(render({}).findNativeInput().getElement()).toHaveAttribute('aria-label', 'Choose files');
  });

  test('`ariaLabel` takes precedence if both `ariaLabel` and `text` are defined', () => {
    expect(render({ ariaLabel: 'aria label' }).findNativeInput().getElement()).toHaveAttribute(
      'aria-label',
      'aria label'
    );
  });

  test('dev warning is issued when `variant` is icon and `ariaLabel` is undefined', () => {
    render({ variant: 'icon' });
    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith('FileInput', 'Aria label is required with icon variant.');
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
    const input = wrapper.findNativeInput().getElement();
    Object.defineProperty(input, 'files', { value: [file1, file2] });
    fireEvent(input, new CustomEvent('change', { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: [file1, file2] } }));
    // additional equality check, because `expect.objectContaining` above thinks file1 === file2
    expect((onChange as jest.Mock).mock.lastCall[0].detail.value[0]).toBe(file1);
    expect((onChange as jest.Mock).mock.lastCall[0].detail.value[1]).toBe(file2);
  });
});

describe('a11y', () => {
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
