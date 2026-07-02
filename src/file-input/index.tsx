// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FileInputProps } from './interfaces';
import InternalFileInput from './internal';

export { FileInputProps };

const FileInput = React.forwardRef(
  ({ multiple, variant, mode, ...props }: FileInputProps, ref: React.Ref<FileInputProps.Ref>) => {
    const baseComponentProps = useBaseComponent('FileInput', {
      props: {
        multiple,
        variant,
        mode,
      },
    });
    return (
      <InternalFileInput
        multiple={multiple}
        variant={variant}
        mode={mode}
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
