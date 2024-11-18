// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import clsx from 'clsx';

import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component/index.js';
import TokenList from '../internal/components/token-list/index.js';
import { fireNonCancelableEvent } from '../internal/events/index.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { useListFocusController } from '../internal/hooks/use-list-focus-controller.js';
import { useMergeRefs } from '../internal/hooks/use-merge-refs/index.js';
import InternalFileToken from './file-token.js';
import { FileTokenGroupProps } from './interfaces.js';

import tokenListStyles from '../internal/components/token-list/styles.css.js';
import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';

type InternalFileTokenGroupProps = FileTokenGroupProps & InternalBaseComponentProps;

function InternalFileTokenGroup({
  items,
  showFileLastModified,
  showFileSize,
  showFileThumbnail,
  i18nStrings,
  onDismiss,
  limit,
  readOnly,
  alignment = 'vertical',
  __internalRootRef,
  ...restProps
}: InternalFileTokenGroupProps) {
  const baseProps = getBaseProps(restProps);

  const [nextFocusIndex, setNextFocusIndex] = useState<null | number>(null);
  const tokenListRef = useListFocusController({
    nextFocusIndex,
    onFocusMoved: target => {
      target.focus();
      setNextFocusIndex(null);
    },
    listItemSelector: `.${tokenListStyles['list-item']}`,
    showMoreSelector: `.${tokenListStyles.toggle}`,
  });

  const mergedRef = useMergeRefs(__internalRootRef, tokenListRef);

  const isImage = (file: File) => file.type.startsWith('image/');
  const groupContainsImage = items.filter(item => isImage(item.file)).length > 0;

  const i18n = useInternalI18n('file-token-group');

  return (
    <div {...baseProps} ref={mergedRef} className={clsx(baseProps.className, styles.root, testStyles.root)}>
      <TokenList
        alignment={alignment === 'horizontal' ? 'horizontal-grid' : alignment}
        items={items}
        renderItem={(file, fileIndex) => (
          <InternalFileToken
            file={file.file}
            showFileLastModified={showFileLastModified}
            showFileSize={showFileSize}
            showFileThumbnail={showFileThumbnail}
            onDismiss={() => {
              fireNonCancelableEvent(onDismiss, { fileIndex });
              setNextFocusIndex(fileIndex);
            }}
            errorText={file.errorText}
            warningText={file.warningText}
            i18nStrings={{
              removeFileAriaLabel: i18n(
                'i18nStrings.removeFileAriaLabel',
                i18nStrings?.removeFileAriaLabel,
                format => fileIndex => format({ fileIndex: fileIndex + 1 })
              ),
              errorIconAriaLabel: i18n('i18nStrings.errorIconAriaLabel', i18nStrings?.errorIconAriaLabel),
              warningIconAriaLabel: i18n('i18nStrings.warningIconAriaLabel', i18nStrings?.warningIconAriaLabel),
              formatFileSize: i18nStrings?.formatFileSize,
              formatFileLastModified: i18nStrings?.formatFileLastModified,
            }}
            loading={file.loading}
            readOnly={readOnly}
            alignment={alignment}
            groupContainsImage={groupContainsImage}
            isImage={isImage(file.file)}
            index={fileIndex}
          />
        )}
        limit={limit}
        i18nStrings={{
          limitShowFewer: i18n('i18nStrings.limitShowFewer', i18nStrings?.limitShowFewer),
          limitShowMore: i18n('i18nStrings.limitShowMore', i18nStrings?.limitShowMore),
        }}
      />
    </div>
  );
}

export default InternalFileTokenGroup;
