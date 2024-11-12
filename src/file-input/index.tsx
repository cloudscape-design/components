// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FileInputProps } from './interfaces';
import InternalFileInput from './internal';

export { FileInputProps };

const FileInput = React.forwardRef(
  ({ multiple, variant, ...props }: FileInputProps, ref: React.Ref<FileInputProps.Ref>) => {
    const baseComponentProps = useBaseComponent('FileInput', {
      props: {
        multiple,
        variant,
      },
    });
    return <InternalFileInput multiple={multiple} variant={variant} {...props} {...baseComponentProps} ref={ref} />;
  }
);

applyDisplayName(FileInput, 'FileInput');
export default FileInput;
