// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.css.js';
import clsx from 'clsx';
import InternalIcon from '../icon/internal';
import InternalBox from '../box/internal';

interface DropzoneProps {
  onChange: (files: File[]) => void;
  children: React.ReactNode;
}

export function useDropzoneVisible() {
  const [isDropzoneVisible, setDropzoneVisible] = useState(false);

  useEffect(() => {
    let dragTimer: null | ReturnType<typeof setTimeout> = null;

    const onDocumentDragOver = (event: DragEvent) => {
      event.preventDefault();

      if (event.dataTransfer && event.dataTransfer.types && event.dataTransfer.types.indexOf('Files') !== -1) {
        setDropzoneVisible(true);
        dragTimer && clearTimeout(dragTimer);
      }
    };

    const onDocumentDragLeave = (event: DragEvent) => {
      event.preventDefault();

      dragTimer = setTimeout(() => setDropzoneVisible(false), 25);
    };

    const onDocumentDrop = (event: DragEvent) => {
      event.preventDefault();

      dragTimer = setTimeout(() => setDropzoneVisible(false), 25);
    };

    document.addEventListener('dragover', onDocumentDragOver, false);
    document.addEventListener('dragleave', onDocumentDragLeave, false);
    document.addEventListener('drop', onDocumentDrop, false);

    return () => {
      dragTimer && clearTimeout(dragTimer);
      document.removeEventListener('dragover', onDocumentDragOver);
      document.removeEventListener('dragleave', onDocumentDragLeave);
      document.removeEventListener('drop', onDocumentDrop);
    };
  }, []);

  return isDropzoneVisible;
}

export function Dropzone({ onChange, children }: DropzoneProps) {
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const [isDropzoneHovered, setDropzoneHovered] = useState(false);

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDropzoneHovered(true);

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  };

  const onDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDropzoneHovered(false);

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'none';
    }
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const newFiles: File[] = [];
    const nullableFiles = event.dataTransfer.items
      ? Array.from(event.dataTransfer.items).map(item => (item.kind === 'file' && item.getAsFile()) || null)
      : Array.from(event.dataTransfer.files);
    nullableFiles.forEach(fileOrNull => fileOrNull && newFiles.push(fileOrNull));

    onChange(newFiles);
    setDropzoneHovered(false);
  };

  return (
    <div
      ref={dropzoneRef}
      className={clsx(styles.dropzone, isDropzoneHovered && styles['dropzone-hovered'])}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <InternalBox color={isDropzoneHovered ? 'text-status-info' : 'text-body-secondary'}>
        <InternalIcon name="file" />
      </InternalBox>
      <InternalBox color={isDropzoneHovered ? 'text-status-info' : 'text-body-secondary'}>{children}</InternalBox>
    </div>
  );
}
