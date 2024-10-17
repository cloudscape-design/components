// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FileDropzoneProps } from './interfaces';
import InternalFileDropzone from './internal';

export { FileDropzoneProps };

const FileDropzone = React.forwardRef(({ ...props }: FileDropzoneProps) => {
  const baseComponentProps = useBaseComponent('FileDropzone', {
    props: {},
  });
  return <InternalFileDropzone {...props} {...baseComponentProps} />;
});

applyDisplayName(FileDropzone, 'FileDropzone');
export default FileDropzone;
