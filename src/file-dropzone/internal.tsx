// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import clsx from 'clsx';

import { fireNonCancelableEvent } from '../internal/events';
import { FileDropzoneProps } from './interfaces';

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
      className={clsx(styles.root, isDropzoneHovered && styles.hovered)}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
}
