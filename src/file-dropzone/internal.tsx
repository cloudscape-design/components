// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { filterByAccept } from '../internal/utils/accept-filter';
import { processDataTransfer } from '../internal/utils/folder-traversal';
import { FileDropzoneProps } from './interfaces';

import styles from './styles.css.js';

export default function InternalFileDropzone({
  onChange,
  children,
  accept,
  __internalRootRef,
  ...restProps
}: FileDropzoneProps & InternalBaseComponentProps) {
  const [isDropzoneHovered, setDropzoneHovered] = useState(false);
  const baseProps = getBaseProps(restProps);

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

  const onDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setDropzoneHovered(false);

    // Process DataTransfer to handle both files and folders
    const allFiles = await processDataTransfer(event.dataTransfer);

    // Apply accept filter to the collected files
    const filteredFiles = filterByAccept(allFiles, accept);

    fireNonCancelableEvent(onChange, { value: filteredFiles });
  };

  return (
    <div
      {...baseProps}
      ref={__internalRootRef}
      className={clsx(baseProps.className, styles.root, {
        [styles.hovered]: isDropzoneHovered,
      })}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
}
