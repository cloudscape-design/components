// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { FileDropzoneProps } from './interfaces';

import styles from './styles.css.js';

export default function InternalFileDropzone({
  onChange,
  children,
  __internalRootRef = null,
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

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDropzoneHovered(false);

    fireNonCancelableEvent(onChange, { value: Array.from(event.dataTransfer.files) });
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
