// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import styles from './styles.css.js';
import clsx from 'clsx';
import InternalIcon from '../../icon/internal';

interface DropzoneProps {
  onChange: (files: File[]) => void;
  children: React.ReactNode;
}

export function useDropzoneVisible(multiple: boolean) {
  const [isDropzoneVisible, setDropzoneVisible] = useState(false);

  // Registering global drag events listeners.
  useEffect(() => {
    // The timer helps avoiding dropzone blinking.
    let dragTimer: null | ReturnType<typeof setTimeout> = null;

    // The file-upload dropzone is shown when the user drags files over to the browser.
    const onDocumentDragOver = (event: DragEvent) => {
      event.preventDefault();

      let files = 0;
      for (let item = 0; item < (event.dataTransfer?.items.length || 0); item++) {
        if (event.dataTransfer?.items[item].kind === 'file') {
          files++;
        }
      }
      if (files > 0 && (multiple || files === 1)) {
        setDropzoneVisible(true);
        dragTimer && clearTimeout(dragTimer);
      }
    };

    // When the files are no longer dragged over the browser the state must be reset.
    const onDocumentDragLeave = (event: DragEvent) => {
      event.preventDefault();

      dragTimer = setTimeout(() => setDropzoneVisible(false), 25);
    };

    // If the files were dropped the state must be reset.
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
  }, [multiple]);

  return isDropzoneVisible;
}

export function Dropzone({ onChange, children }: DropzoneProps) {
  const [isDropzoneHovered, setDropzoneHovered] = useState(false);

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();

    if (event.dataTransfer) {
      setDropzoneHovered(true);
      event.dataTransfer.dropEffect = 'copy';
    }
  };

  const onDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDropzoneHovered(false);

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'none';
    }
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDropzoneHovered(false);

    onChange(Array.from(event.dataTransfer.files));
  };

  return (
    <div
      className={clsx(styles.dropzone, isDropzoneHovered && styles['dropzone-hovered'])}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <InternalIcon name="upload" />
      <span>{children}</span>
    </div>
  );
}
