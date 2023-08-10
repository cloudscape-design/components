// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Dropzone, useDropzoneVisible } from '../../../lib/components/file-upload/dropzone';
import selectors from '../../../lib/components/file-upload/dropzone/styles.selectors.js';
import FileUpload, { FileUploadProps } from '../../../lib/components/file-upload';

const file1 = new File([new Blob(['Test content 1'], { type: 'text/plain' })], 'test-file-1.txt', {
  type: 'text/plain',
  lastModified: 1590962400000,
});
const file2 = new File([new Blob(['Test content 2'], { type: 'text/plain' })], 'test-file-2.txt', {
  type: 'image/png',
  lastModified: 1590962400000,
});

function createDragEvent(type: string, files = [file1, file2]) {
  const event = new CustomEvent(type, { bubbles: true });
  (event as any).dataTransfer = {
    types: ['Files'],
    files: type === 'drop' ? files : [],
    items: files,
  };
  return event;
}

function TestDropzoneVisible() {
  const isDropzoneVisible = useDropzoneVisible();
  return <div>{isDropzoneVisible ? 'visible' : 'hidden'}</div>;
}

const i18nStrings: FileUploadProps.I18nStrings = {
  uploadButtonText: multiple => (multiple ? 'Choose files' : 'Choose file'),
  dropzoneText: multiple => (multiple ? 'Drag files to upload' : 'Drag file to upload'),
  removeFileAriaLabel: fileIndex => `Remove file ${fileIndex + 1}`,
  errorIconAriaLabel: 'Error',
  limitShowFewer: 'Show fewer files',
  limitShowMore: 'Show more files',
};

describe('File upload dropzone', () => {
  test('Dropzone becomes visible once global dragover event is received', () => {
    render(<TestDropzoneVisible />);
    expect(screen.getByText('hidden')).toBeDefined();

    fireEvent(document, createDragEvent('dragover'));

    expect(screen.getByText('visible')).toBeDefined();
  });

  test('Dropzone hides after a delay once global dragleave event is received', async () => {
    render(<TestDropzoneVisible />);

    fireEvent(document, createDragEvent('dragover'));

    expect(screen.getByText('visible')).toBeDefined();

    fireEvent(document, createDragEvent('dragleave'));

    await waitFor(() => {
      expect(screen.getByText('hidden')).toBeDefined();
    });
  });

  test('Dropzone hides after a delay once global drop event is received', async () => {
    render(<TestDropzoneVisible />);

    fireEvent(document, createDragEvent('dragover'));

    expect(screen.getByText('visible')).toBeDefined();

    fireEvent(document, createDragEvent('drop'));

    await waitFor(() => {
      expect(screen.getByText('hidden')).toBeDefined();
    });
  });

  test('dropzone is rendered in component', () => {
    render(<FileUpload value={[]} i18nStrings={i18nStrings} />);
    fireEvent(document, createDragEvent('dragover'));
    expect(screen.getByText('Drag file to upload')).toBeDefined();
  });

  test('dropzone renders provided children', () => {
    render(<Dropzone onChange={jest.fn()}>Drop files here</Dropzone>);
    expect(screen.findByText('Drop files here')).toBeDefined();
  });

  test('dropzone is hovered on dragover and un-hovered on dragleave', () => {
    const { container } = render(
      <Dropzone onChange={jest.fn()} multiple={true}>
        Drop files here
      </Dropzone>
    );
    const dropzone = container.querySelector(`.${selectors.dropzone}`)!;

    expect(dropzone).not.toHaveClass(selectors['dropzone-hovered']);

    fireEvent(dropzone, createDragEvent('dragover'));

    expect(dropzone).toHaveClass(selectors['dropzone-hovered']);

    fireEvent(dropzone, createDragEvent('dragleave'));

    expect(dropzone).not.toHaveClass(selectors['dropzone-hovered']);
  });

  test('dropzone fires onChange on drop', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Dropzone onChange={onChange} multiple={true}>
        Drop files here
      </Dropzone>
    );
    const dropzone = container.querySelector(`.${selectors.dropzone}`)!;

    fireEvent(dropzone, createDragEvent('drop'));

    expect(onChange).toHaveBeenCalledWith([file1, file2]);
  });

  describe('dragging on non-multiple zone', () => {
    test('dropzone is not hovered on dragover of multiple files', () => {
      const { container } = render(<Dropzone onChange={jest.fn()}>Drop files here</Dropzone>);
      const dropzone = container.querySelector(`.${selectors.dropzone}`)!;

      fireEvent(dropzone, createDragEvent('dragover'));

      expect(dropzone).not.toHaveClass(selectors['dropzone-hovered']);
    });
    test('dropzone is hovered on dragover of single file', () => {
      const { container } = render(<Dropzone onChange={jest.fn()}>Drop files here</Dropzone>);
      const dropzone = container.querySelector(`.${selectors.dropzone}`)!;

      fireEvent(dropzone, createDragEvent('dragover', [file1]));

      expect(dropzone).toHaveClass(selectors['dropzone-hovered']);
    });

    test('dropzone fires no onChange on drop of multiple files', () => {
      const onChange = jest.fn();
      const { container } = render(<Dropzone onChange={onChange}>Drop files here</Dropzone>);
      const dropzone = container.querySelector(`.${selectors.dropzone}`)!;

      fireEvent(dropzone, createDragEvent('drop'));

      expect(onChange).not.toHaveBeenCalled();
    });

    test('dropzone fires onChange on drop of single file', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Dropzone onChange={onChange} multiple={true}>
          Drop files here
        </Dropzone>
      );
      const dropzone = container.querySelector(`.${selectors.dropzone}`)!;

      fireEvent(dropzone, createDragEvent('drop', [file1]));

      expect(onChange).toHaveBeenCalledWith([file1]);
    });
  });
});
