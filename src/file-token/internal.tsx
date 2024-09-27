// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { forwardRef, Ref } from 'react';

import InternalBox from '../box/internal';
import { fireNonCancelableEvent } from '../internal/events';
import InternalSpaceBetween from '../space-between/internal';
import { Token } from '../token-group/token';
import * as defaultFormatters from './default-formatters';
import { FileTokenProps } from './interfaces';
import { FileOptionThumbnail } from './thumbnail';

import styles from './styles.css.js';

function InternalFileToken(
  {
    file,
    showFileLastModified,
    showFileSize,
    showFileThumbnail,
    i18nStrings,
    onDismiss,
    errorText,
    warningText,
  }: FileTokenProps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ref: Ref<FileTokenProps.Ref>
) {
  const isImage = file.type.startsWith('image/');
  const formatFileSize = i18nStrings.formatFileSize ?? defaultFormatters.formatFileSize;
  const formatFileLastModified = i18nStrings.formatFileLastModified ?? defaultFormatters.formatFileLastModified;
  return (
    <Token
      ariaLabel={file.name}
      dismissLabel={i18nStrings.removeFileAriaLabel(0)}
      onDismiss={() => {
        fireNonCancelableEvent(onDismiss);
      }}
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

export default forwardRef(InternalFileToken);
