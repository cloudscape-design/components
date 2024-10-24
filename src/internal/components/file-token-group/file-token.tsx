// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import clsx from 'clsx';

import InternalBox from '../../../box/internal.js';
import InternalLiveRegion from '../../../live-region/internal';
import InternalSpaceBetween from '../../../space-between/internal.js';
import InternalSpinner from '../../../spinner/internal.js';
import { TokenGroupProps } from '../../../token-group/interfaces.js';
import { Token } from '../../../token-group/token.js';
import { BaseComponentProps } from '../../base-component/index.js';
import Tooltip from '../tooltip/index';
import * as defaultFormatters from './default-formatters.js';
import { FileOptionThumbnail } from './thumbnail.js';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

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
  loadingText?: string;
  i18nStrings: FileTokenProps.I18nStrings;
  disabled?: boolean;
  dismissLabel?: string;
  alignment?: TokenGroupProps.Alignment;
  groupContainsImage?: boolean;
  index: number;
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
  disabled,
  loading,
  loadingText,
  alignment,
  groupContainsImage,
  index,
}: FileTokenProps) {
  const isImage = file.type.startsWith('image/');
  const formatFileSize = i18nStrings.formatFileSize ?? defaultFormatters.formatFileSize;
  const formatFileLastModified = i18nStrings.formatFileLastModified ?? defaultFormatters.formatFileLastModified;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      ref={containerRef}
      className={clsx(styles['file-token'])}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      {loading && (
        <>
          <div className={styles['file-loading-overlay']} />
          <div className={styles['file-loading-overlay-spinner']}>
            <InternalSpinner variant="disabled" size="normal" />
          </div>
        </>
      )}
      <Token
        ariaLabel={file.name}
        dismissLabel={i18nStrings.removeFileAriaLabel(index)}
        onDismiss={onDismiss}
        errorText={errorText}
        warningText={warningText}
        errorIconAriaLabel={i18nStrings.errorIconAriaLabel}
        warningIconAriaLabel={i18nStrings.warningIconAriaLabel}
        disabled={disabled}
        alignment={alignment}
        groupContainsImage={groupContainsImage && showFileThumbnail && alignment === 'horizontal' && !imageError}
        data-index={index}
      >
        <InternalBox className={styles['file-option']}>
          {showFileThumbnail && isImage && <FileOptionThumbnail file={file} setHasError={setImageError} />}

          <div
            className={clsx(styles['file-option-metadata'], {
              [styles['with-image']]: showFileThumbnail && isImage,
            })}
          >
            <InternalSpaceBetween direction="vertical" size="xxxs">
              <div onMouseOver={() => setShowTooltip(true)} onMouseOut={() => setShowTooltip(false)}>
                <InternalBox
                  fontWeight="normal"
                  className={clsx(styles['file-option-name'], testUtilStyles['file-option-name'])}
                >
                  {file.name}
                </InternalBox>
              </div>

              {showFileSize && file.size ? (
                <InternalBox
                  fontSize="body-s"
                  color="text-body-secondary"
                  className={clsx(styles['file-option-size'], testUtilStyles['file-option-size'])}
                >
                  {formatFileSize(file.size)}
                </InternalBox>
              ) : null}

              {showFileLastModified && file.lastModified ? (
                <InternalBox
                  fontSize="body-s"
                  color="text-body-secondary"
                  className={clsx(styles['file-option-last-modified'], testUtilStyles['file-option-last-modified'])}
                >
                  {formatFileLastModified(new Date(file.lastModified))}
                </InternalBox>
              ) : null}
            </InternalSpaceBetween>
          </div>
        </InternalBox>
      </Token>
      {alignment === 'horizontal' && showTooltip && (
        <Tooltip
          trackRef={containerRef}
          trackKey={file.name}
          value={<InternalBox fontWeight="normal">{file.name}</InternalBox>}
        />
      )}
      {loading && loadingText && <InternalLiveRegion>{loadingText}</InternalLiveRegion>}
    </div>
  );
}

export default InternalFileToken;
