// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FileUploadProps } from './interfaces';
import InternalFileUpload from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';
import { getExternalProps } from '../internal/utils/external-props';

export { FileUploadProps };

const FileUpload = React.forwardRef(
  (
    { multiple, showFileSize, showFileLastModified, showFileThumbnail, ...restProps }: FileUploadProps,
    ref: React.Ref<FileUploadProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('FileUpload', {
      props: { multiple, showFileLastModified, showFileSize, showFileThumbnail, tokenLimit: restProps.tokenLimit },
    });
    const externalProps = getExternalProps(restProps);
    return (
      <InternalFileUpload
        ref={ref}
        multiple={multiple}
        showFileSize={showFileSize}
        showFileLastModified={showFileLastModified}
        showFileThumbnail={showFileThumbnail}
        {...externalProps}
        {...baseComponentProps}
      />
    );
  }
);

applyDisplayName(FileUpload, 'FileUpload');
export default FileUpload;
