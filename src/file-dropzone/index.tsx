// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FileDropzoneProps } from './interfaces';
import InternalFileDropzone from './internal';
import { useFilesDragging } from './use-files-dragging';

export { FileDropzoneProps, useFilesDragging };

export default function FileDropzone(props: FileDropzoneProps) {
  const baseComponentProps = useBaseComponent('FileDropzone');
  return <InternalFileDropzone {...baseComponentProps} {...props} />;
}

applyDisplayName(FileDropzone, 'FileDropzone');
