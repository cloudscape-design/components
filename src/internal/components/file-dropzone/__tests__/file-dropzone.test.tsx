// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import InternalFileDropzone, { useFileDragging } from '../../../../../lib/components/internal/components/file-dropzone';
import FileDropzoneWrapper from '../../../../../lib/components/test-utils/dom/internal/file-dropzone';

import selectors from '../../../../../lib/components/internal/components/file-dropzone/styles.selectors.js';

const file1 = new File([new Blob(['Test content 1'], { type: 'text/plain' })], 'test-file-1.txt', {
  type: 'text/plain',
  lastModified: 1590962400000,
});
const file2 = new File([new Blob(['Test content 2'], { type: 'text/plain' })], 'test-file-2.txt', {
  type: 'image/png',
  lastModified: 1590962400000,
});

const onChange = jest.fn();

function createDragEvent(type: string, files = [file1, file2]) {
  const event = new CustomEvent(type, { bubbles: true });
  (event as any).dataTransfer = {
    types: ['Files'],
    files: type === 'drop' ? files : [],
    items: files.map(() => ({ kind: 'file' })),
  };
  return event;
}

function TestDropzoneVisible() {
  const isFileDragging = useFileDragging();
  return <div>{isFileDragging ? 'visible' : 'hidden'}</div>;
}

describe('File upload dropzone', () => {
  test('Dropzone becomes visible once global dragover event is received', () => {
    render(<TestDropzoneVisible />);
    expect(screen.getByText('hidden')).toBeDefined();

    fireEvent(document, createDragEvent('dragover', [file1]));

    expect(screen.getByText('visible')).toBeDefined();
  });

  test('Dropzone shows if multiple files dragged into zone', () => {
    render(<TestDropzoneVisible />);
    expect(screen.getByText('hidden')).toBeDefined();

    fireEvent(document, createDragEvent('dragover', [file1, file2]));

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

  test('dropzone renders provided children', () => {
    render(<InternalFileDropzone onChange={jest.fn()}>Drop files here</InternalFileDropzone>);
    expect(screen.findByText('Drop files here')).toBeDefined();
  });

  test('dropzone is hovered on dragover and un-hovered on dragleave', () => {
    const { container } = render(<InternalFileDropzone onChange={onChange}>Drop files here</InternalFileDropzone>);
    const dropzone = container.querySelector(`.${FileDropzoneWrapper.rootSelector}`)!;

    expect(dropzone).not.toHaveClass(selectors.hovered);

    fireEvent(dropzone, createDragEvent('dragover'));

    expect(dropzone).toHaveClass(selectors.hovered);

    fireEvent(dropzone, createDragEvent('dragleave'));

    expect(dropzone).not.toHaveClass(selectors.hovered);
  });

  test('dropzone fires onChange on drop', () => {
    const { container } = render(<InternalFileDropzone onChange={onChange}>Drop files here</InternalFileDropzone>);
    const dropzone = container.querySelector(`.${FileDropzoneWrapper.rootSelector}`)!;

    fireEvent(dropzone, createDragEvent('drop'));

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: [file1, file2] } }));
  });
});
