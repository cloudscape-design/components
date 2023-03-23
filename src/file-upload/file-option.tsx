// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { FileMetadata, FileUploadProps } from './interfaces';
import InternalBox from '../box/internal';
import InternalSpaceBetween from '../space-between/internal';
import InternalIcon from '../icon/internal';
import styles from './styles.css.js';
import * as defaultFormatters from './default-formatters';
import { FileOptionThumbnail } from './file-option-thumbnail';

interface FileOptionProps {
  file: File;
  metadata: FileMetadata;
  fileProps?: FileUploadProps.FileProps;
  i18nStrings: FileUploadProps.I18nStrings;
}

export function FileOption({ file, metadata, fileProps, i18nStrings }: FileOptionProps) {
  const isImage = !!file.type && file.type.split('/')[0] === 'image';
  const formatFileSize = i18nStrings.formatFileSize ?? defaultFormatters.formatFileSize;
  const formatFileLastModified = i18nStrings.formatFileLastModified ?? defaultFormatters.formatFileLastModified;
  return (
    <InternalBox className={styles['file-option']}>
      {!fileProps || fileProps?.status === 'success' ? (
        <InternalIcon variant="success" name="status-positive" />
      ) : (
        <InternalIcon variant="error" name="status-warning" />
      )}

      {metadata.showFileThumbnail && isImage && <FileOptionThumbnail file={file} />}

      <div className={styles['file-option-metadata']}>
        <InternalSpaceBetween direction="vertical" size="xxxs">
          <InternalBox className={styles['file-option-name']}>{file.name}</InternalBox>

          {metadata.showFileType && file.type ? (
            <InternalBox fontSize="body-s" color="text-body-secondary" className={styles['file-option-type']}>
              {file.type}
            </InternalBox>
          ) : null}

          {metadata.showFileSize && file.size ? (
            <InternalBox fontSize="body-s" color="text-body-secondary" className={styles['file-option-size']}>
              {formatFileSize(file.size)}
            </InternalBox>
          ) : null}

          {metadata.showFileLastModified && file.lastModified ? (
            <InternalBox fontSize="body-s" color="text-body-secondary" className={styles['file-option-last-modified']}>
              {formatFileLastModified(new Date(file.lastModified))}
            </InternalBox>
          ) : null}
        </InternalSpaceBetween>
      </div>
    </InternalBox>
  );
}
