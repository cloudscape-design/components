// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import InternalBox from '../box/internal.js';
import { BaseComponentProps } from '../internal/base-component';
import InternalSpaceBetween from '../space-between/internal.js';
import { Token } from '../token-group/token.js';
import * as defaultFormatters from './default-formatters.js';
import { FileOptionThumbnail } from './thumbnail.js';

import styles from './styles.css.js';

export namespace FileTokenProps {
  export interface I18nStrings {
    removeFileAriaLabel: (fileIndex: number) => string;
    errorIconAriaLabel?: string;
    warningIconAriaLabel?: string;
    formatFileSize?: (sizeInBytes: number) => string;
    formatFileLastModified?: (date: Date) => string;
  }
}

export interface FileTokenProps extends BaseComponentProps {
  file: File;
  onDismiss: () => void;
  showFileSize?: boolean;
  showFileLastModified?: boolean;
  showFileThumbnail?: boolean;
  errorText?: React.ReactNode;
  warningText?: React.ReactNode;
  loading?: boolean;
  i18nStrings: FileTokenProps.I18nStrings;
}

function InternalFileToken({
  file,
  showFileLastModified,
  showFileSize,
  showFileThumbnail,
  i18nStrings,
  onDismiss,
  errorText,
  warningText,
}: FileTokenProps) {
  const isImage = file.type.startsWith('image/');
  const formatFileSize = i18nStrings.formatFileSize ?? defaultFormatters.formatFileSize;
  const formatFileLastModified = i18nStrings.formatFileLastModified ?? defaultFormatters.formatFileLastModified;
  return (
    <Token
      ariaLabel={file.name}
      dismissLabel={i18nStrings.removeFileAriaLabel(0)}
      onDismiss={onDismiss}
      errorText={errorText}
      warningText={warningText}
      errorIconAriaLabel={i18nStrings.errorIconAriaLabel}
      warningIconAriaLabel={i18nStrings.warningIconAriaLabel}
      data-index={0}
    >
      <InternalBox className={styles['file-option']}>
        {showFileThumbnail && isImage && <FileOptionThumbnail file={file} />}

        <div className={styles['file-option-metadata']}>
          <InternalSpaceBetween direction="vertical" size="xxxs">
            <InternalBox className={styles['file-option-name']}>{file.name}</InternalBox>

            {showFileSize && file.size ? (
              <InternalBox fontSize="body-s" color="text-body-secondary" className={styles['file-option-size']}>
                {formatFileSize(file.size)}
              </InternalBox>
            ) : null}

            {showFileLastModified && file.lastModified ? (
              <InternalBox
                fontSize="body-s"
                color="text-body-secondary"
                className={styles['file-option-last-modified']}
              >
                {formatFileLastModified(new Date(file.lastModified))}
              </InternalBox>
            ) : null}
          </InternalSpaceBetween>
        </div>
      </InternalBox>
    </Token>
  );
}

export default InternalFileToken;
