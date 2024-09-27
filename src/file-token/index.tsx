// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FileTokenProps } from './interfaces';
import InternalFileToken from './internal';

export { FileTokenProps };

const FileToken = React.forwardRef(
  (
    { showFileLastModified, showFileSize, showFileThumbnail, ...props }: FileTokenProps,
    ref: React.Ref<FileTokenProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('FileToken', {
      props: {
        showFileLastModified,
        showFileSize,
        showFileThumbnail,
      },
    });
    return (
      <InternalFileToken
        showFileLastModified={showFileLastModified}
        showFileSize={showFileSize}
        showFileThumbnail={showFileThumbnail}
        {...props}
        {...baseComponentProps}
        ref={ref}
      />
    );
  }
);

applyDisplayName(FileToken, 'FileToken');
export default FileToken;
