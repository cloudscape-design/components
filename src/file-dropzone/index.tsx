// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { FileDropzoneProps } from './interfaces.js';
import InternalFileDropzone from './internal.js';
import { useFilesDragging } from './use-files-dragging.js';

export { FileDropzoneProps, useFilesDragging };

export default function FileDropzone(props: FileDropzoneProps) {
  const baseComponentProps = useBaseComponent('FileDropzone');
  return <InternalFileDropzone {...baseComponentProps} {...props} />;
}

applyDisplayName(FileDropzone, 'FileDropzone');
