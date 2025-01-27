// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import InternalBox from '../box/internal.js';
import { FormFieldError, FormFieldWarning } from '../form-field/internal';
import { BaseComponentProps } from '../internal/base-component/index.js';
import Tooltip from '../internal/components/tooltip/index';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import InternalSpaceBetween from '../space-between/internal.js';
import InternalSpinner from '../spinner/internal.js';
import DismissButton from '../token-group/dismiss-button';
import { TokenGroupProps } from '../token-group/interfaces.js';
import * as defaultFormatters from './default-formatters.js';
import { FileOptionThumbnail } from './thumbnail.js';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export namespace FileTokenProps {
  export interface I18nStrings {
    removeFileAriaLabel?: (fileIndex: number) => string;
    errorIconAriaLabel?: string;
    warningIconAriaLabel?: string;
    formatFileSize?: (sizeInBytes: number) => string;
    formatFileLastModified?: (date: Date) => string;
  }
}

interface FileTokenProps extends BaseComponentProps {
  file: File;
  onDismiss: () => void;
  showFileSize?: boolean;
  showFileLastModified?: boolean;
  showFileThumbnail?: boolean;
  errorText?: React.ReactNode;
  warningText?: React.ReactNode;
  loading?: boolean;
  readOnly?: boolean;
  i18nStrings?: FileTokenProps.I18nStrings;
  dismissLabel?: string;
  alignment?: TokenGroupProps.Alignment;
  groupContainsImage?: boolean;
  isImage: boolean;
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
  readOnly,
  loading,
  alignment,
  groupContainsImage,
  isImage,
  index,
}: FileTokenProps) {
  const formatFileSize = i18nStrings?.formatFileSize ?? defaultFormatters.formatFileSize;
  const formatFileLastModified = i18nStrings?.formatFileLastModified ?? defaultFormatters.formatFileLastModified;

  const errorId = useUniqueId('error');
  const warningId = useUniqueId('warning');

  const showWarning = warningText && !errorText;
  const containerRef = useRef<HTMLDivElement>(null);
  const fileNameRef = useRef<HTMLSpanElement>(null);
  const fileNameContainerRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const getDismissLabel = (fileIndex: number) => {
    return i18nStrings?.removeFileAriaLabel?.(fileIndex);
  };

  function isEllipsisActive() {
    const span = fileNameRef.current;
    const container = fileNameContainerRef.current;

    if (span && container) {
      return span.offsetWidth >= container.offsetWidth;
    }
    return false;
  }

  const fileIsSingleRow =
    !showFileLastModified && !showFileSize && (!groupContainsImage || (groupContainsImage && !showFileThumbnail));

  return (
    <div
      ref={containerRef}
      className={clsx(styles.token, {
        [styles['token-grid']]: alignment === 'horizontal',
        [styles['token-contains-image']]: groupContainsImage && showFileThumbnail,
      })}
      role="group"
      aria-label={file.name}
      aria-describedby={errorText ? errorId : warningText ? warningId : undefined}
      aria-disabled={loading}
      data-index={index}
    >
      <div
        className={clsx(styles['token-box'], {
          [styles.loading]: loading,
          [styles.error]: errorText,
          [styles.warning]: showWarning,
          [styles.horizontal]: alignment === 'horizontal',
          [styles['read-only']]: readOnly,
        })}
      >
        {loading && (
          <div
            className={clsx(styles['file-loading-overlay'], {
              [styles['file-loading-overlay-single-row']]: loading && fileIsSingleRow,
            })}
          >
            <InternalSpinner variant="disabled" size="normal" />
          </div>
        )}
        <InternalBox className={styles['file-option']}>
          {showFileThumbnail && isImage && <FileOptionThumbnail file={file} />}

          <div
            className={clsx(styles['file-option-metadata'], {
              [styles['with-image']]: showFileThumbnail && isImage,
              [styles['single-row-loading']]: loading && fileIsSingleRow,
            })}
          >
            <InternalSpaceBetween direction="vertical" size="xxxs">
              <div
                onMouseOver={() => setShowTooltip(true)}
                onMouseOut={() => setShowTooltip(false)}
                ref={fileNameContainerRef}
              >
                <InternalBox
                  fontWeight="normal"
                  className={clsx(styles['file-option-name'], testUtilStyles['file-option-name'], {
                    [testUtilStyles['ellipsis-active']]: isEllipsisActive(),
                  })}
                >
                  <span ref={fileNameRef}>{file.name}</span>
                </InternalBox>
              </div>

              {showFileSize && file.size ? (
                <InternalBox
                  fontSize="body-s"
                  color={'text-body-secondary'}
                  className={clsx(styles['file-option-size'], testUtilStyles['file-option-size'])}
                >
                  {formatFileSize(file.size)}
                </InternalBox>
              ) : null}

              {showFileLastModified && file.lastModified ? (
                <InternalBox
                  fontSize="body-s"
                  color={'text-body-secondary'}
                  className={clsx(styles['file-option-last-modified'], testUtilStyles['file-option-last-modified'])}
                >
                  {formatFileLastModified(new Date(file.lastModified))}
                </InternalBox>
              ) : null}
            </InternalSpaceBetween>
          </div>
        </InternalBox>
        {onDismiss && !readOnly && <DismissButton dismissLabel={getDismissLabel(index)} onDismiss={onDismiss} />}
      </div>
      {errorText && (
        <FormFieldError id={errorId} errorIconAriaLabel={i18nStrings?.errorIconAriaLabel}>
          {errorText}
        </FormFieldError>
      )}
      {showWarning && (
        <FormFieldWarning id={warningId} warningIconAriaLabel={i18nStrings?.warningIconAriaLabel}>
          {warningText}
        </FormFieldWarning>
      )}
      {showTooltip && isEllipsisActive() && (
        <Tooltip
          trackRef={containerRef}
          trackKey={file.name}
          value={<InternalBox fontWeight="normal">{file.name}</InternalBox>}
          onDismiss={() => setShowTooltip(false)}
        />
      )}
    </div>
  );
}

export default InternalFileToken;
