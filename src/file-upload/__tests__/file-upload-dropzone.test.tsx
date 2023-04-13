// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Dropzone, useDropzoneVisible } from '../../../lib/components/file-upload/dropzone';
import selectors from '../../../lib/components/file-upload/dropzone/styles.selectors.js';

const file1 = new File([new Blob(['Test content 1'], { type: 'text/plain' })], 'test-file-1.txt', {
  type: 'text/plain',
  lastModified: 1590962400000,
});
const file2 = new File([new Blob(['Test content 2'], { type: 'text/plain' })], 'test-file-2.txt', {
  type: 'image/png',
  lastModified: 1590962400000,
});

function createDragEvent(type: string) {
  const event = new CustomEvent(type, { bubbles: true });
  (event as any).dataTransfer = { types: ['Files'], files: [file1, file2] };
  return event;
}

function TestDropzoneVisible() {
  const isDropzoneVisible = useDropzoneVisible();
  return <div>{isDropzoneVisible ? 'visible' : 'hidden'}</div>;
}

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

  test('dropzone renders provided children', () => {
    render(<Dropzone onChange={jest.fn()}>Drop files here</Dropzone>);
    expect(screen.findByText('Drop files here')).toBeDefined();
  });

  test('dropzone is hovered on dragover and un-hovered on dragleave', () => {
    const { container } = render(<Dropzone onChange={jest.fn()}>Drop files here</Dropzone>);
    const dropzone = container.querySelector(`.${selectors.dropzone}`)!;

    expect(dropzone).not.toHaveClass(selectors['dropzone-hovered']);

    fireEvent(dropzone, createDragEvent('dragover'));

    expect(dropzone).toHaveClass(selectors['dropzone-hovered']);

    fireEvent(dropzone, createDragEvent('dragleave'));

    expect(dropzone).not.toHaveClass(selectors['dropzone-hovered']);
  });

  test('dropzone fires onChange on drop', () => {
    const onChange = jest.fn();
    const { container } = render(<Dropzone onChange={onChange}>Drop files here</Dropzone>);
    const dropzone = container.querySelector(`.${selectors.dropzone}`)!;

    fireEvent(dropzone, createDragEvent('drop'));

    expect(onChange).toHaveBeenCalledWith([file1, file2]);
  });
});
