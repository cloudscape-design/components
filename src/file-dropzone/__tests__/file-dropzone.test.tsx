// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Button from '../../../lib/components/button';
import FileDropzone, { FileDropzoneProps, useFilesDragging } from '../../../lib/components/file-dropzone';
import createWrapper from '../../../lib/components/test-utils/dom';

import selectors from '../../../lib/components/file-dropzone/styles.selectors.js';

const file1 = new File([new Blob(['Test content 1'], { type: 'text/plain' })], 'test-file-1.txt', {
  type: 'text/plain',
  lastModified: 1590962400000,
});
const file2 = new File([new Blob(['Test content 2'], { type: 'text/plain' })], 'test-file-2.txt', {
  type: 'image/png',
  lastModified: 1590962400000,
});

const onChange = jest.fn();

function renderFileDropzone(props: Partial<FileDropzoneProps>) {
  const { container } = render(<FileDropzone onChange={onChange}>{props.children}</FileDropzone>);
  return createWrapper(container).findFileDropzone()!;
}

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
  const { areFilesDragging } = useFilesDragging();
  return <div>{areFilesDragging ? 'visible' : 'hidden'}</div>;
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
    renderFileDropzone({ children: 'Drop files here' });
    expect(screen.findByText('Drop files here')).toBeDefined();
  });

  test('dropzone correctly renders buttons as children', () => {
    const buttonOnClick = jest.fn();
    const wrapper = renderFileDropzone({ children: <Button onClick={buttonOnClick}>test</Button> });

    const button = wrapper.findContent().findButton()!.getElement();

    button.click();

    expect(button).toHaveTextContent('test');
    expect(buttonOnClick).toHaveBeenCalledTimes(1);
  });

  test('dropzone is hovered on dragover and un-hovered on dragleave', () => {
    const dropzone = renderFileDropzone({ children: 'Drop files here' }).getElement();

    expect(dropzone).not.toHaveClass(selectors.hovered);

    fireEvent(dropzone, createDragEvent('dragover'));

    expect(dropzone).toHaveClass(selectors.hovered);

    fireEvent(dropzone, createDragEvent('dragleave'));

    expect(dropzone).not.toHaveClass(selectors.hovered);
  });

  test('dropzone fires onChange on drop', () => {
    const dropzone = renderFileDropzone({ children: 'Drop files here' }).getElement();

    fireEvent(dropzone, createDragEvent('drop'));

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: [file1, file2] } }));
  });
});
