// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { FileInputProps } from './interfaces.js';
import InternalFileInput from './internal.js';

export { FileInputProps };

const FileInput = React.forwardRef(
  ({ multiple, variant, ...props }: FileInputProps, ref: React.Ref<FileInputProps.Ref>) => {
    const baseComponentProps = useBaseComponent('FileInput', {
      props: {
        multiple,
        variant,
      },
    });
    return (
      <InternalFileInput
        multiple={multiple}
        variant={variant}
        {...props}
        {...baseComponentProps}
        ref={ref}
        __injectAnalyticsComponentMetadata={true}
      />
    );
  }
);

applyDisplayName(FileInput, 'FileInput');
export default FileInput;
