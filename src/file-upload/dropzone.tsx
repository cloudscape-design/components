// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
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

    const onDragOver = (event: DragEvent) => {
      if (event.dataTransfer && event.dataTransfer.types && event.dataTransfer.types.indexOf('Files') !== -1) {
        setDropzoneVisible(true);
        dragTimer && clearTimeout(dragTimer);
      }
    };

    const onDragLeave = () => {
      dragTimer = setTimeout(() => setDropzoneVisible(false), 25);
    };

    document.addEventListener('dragover', onDragOver);
    document.addEventListener('dragleave', onDragLeave);
    document.addEventListener('drop', onDragLeave);

    return () => {
      dragTimer && clearTimeout(dragTimer);
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('dragleave', onDragLeave);
      document.removeEventListener('drop', onDragLeave);
    };
  }, []);

  return isDropzoneVisible;
}

export function Dropzone({ onChange, children }: DropzoneProps) {
  const [isDropzoneHovered, setDropzoneHovered] = useState(false);

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDropzoneHovered(true);
  };

  const onDragLeave = () => {
    setDropzoneHovered(false);
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
