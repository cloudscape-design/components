// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FileTokenGroupProps } from './interfaces';
import InternalFileTokenGroup from './internal';

export { FileTokenGroupProps };

const FileTokenGroup = ({
  showFileLastModified,
  showFileSize,
  showFileThumbnail,
  alignment,
  limit,
  ...props
}: FileTokenGroupProps) => {
  const baseComponentProps = useBaseComponent('FileTokenGroup', {
    props: {
      showFileLastModified,
      showFileSize,
      showFileThumbnail,
      alignment,
      limit,
    },
  });
  return (
    <InternalFileTokenGroup
      showFileLastModified={showFileLastModified}
      showFileSize={showFileSize}
      showFileThumbnail={showFileThumbnail}
      alignment={alignment}
      limit={limit}
      {...props}
      {...baseComponentProps}
    />
  );
};

applyDisplayName(FileTokenGroup, 'FileTokenGroup');
export default FileTokenGroup;
