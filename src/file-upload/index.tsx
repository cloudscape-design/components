// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FileUploadProps } from './interfaces';
import InternalFileUpload from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { FileUploadProps };

export default function FileUpload({ ...props }: FileUploadProps) {
  const baseComponentProps = useBaseComponent('FileUpload');
  return <InternalFileUpload {...props} {...baseComponentProps} />;
}

applyDisplayName(FileUpload, 'FileUpload');
