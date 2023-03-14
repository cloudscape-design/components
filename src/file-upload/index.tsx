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
    {
      accept = 'text/plain',
      multiple = false,
      showFileType = false,
      showFileSize = false,
      showFileLastModified = false,
      showFileThumbnail = false,
      i18nStrings = {},
      ...restProps
    }: FileUploadProps,
    ref: React.Ref<FileUploadProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('FileUpload');
    const externalProps = getExternalProps(restProps);
    return (
      <InternalFileUpload
        ref={ref}
        accept={accept}
        multiple={multiple}
        showFileType={showFileType}
        showFileSize={showFileSize}
        showFileLastModified={showFileLastModified}
        showFileThumbnail={showFileThumbnail}
        i18nStrings={i18nStrings}
        {...externalProps}
        {...baseComponentProps}
      />
    );
  }
);

applyDisplayName(FileUpload, 'FileUpload');
export default FileUpload;
