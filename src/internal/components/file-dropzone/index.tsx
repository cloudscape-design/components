// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import clsx from 'clsx';

import { fireNonCancelableEvent } from '../../events';
import { FileDropzoneProps } from './interfaces.js';

import styles from './styles.css.js';

export default function InternalFileDropzone({ onChange, children }: FileDropzoneProps) {
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

    fireNonCancelableEvent(onChange, { value: Array.from(event.dataTransfer.files) });
  };

  return (
    <div
      className={clsx(styles.dropzone, isDropzoneHovered && styles['dropzone-hovered'])}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
}
