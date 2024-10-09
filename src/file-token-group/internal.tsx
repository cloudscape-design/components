// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import TokenList from '../internal/components/token-list';
import { fireNonCancelableEvent } from '../internal/events/index.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useListFocusController } from '../internal/hooks/use-list-focus-controller';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import InternalFileToken from './file-token.js';
import { FileTokenGroupProps } from './interfaces.js';

import tokenListStyles from '../internal/components/token-list/styles.css.js';
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
  alignment = 'vertical',
  __internalRootRef,
}: InternalFileTokenGroupProps) {
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

  return (
    <div ref={mergedRef} className={testStyles.root}>
      <TokenList
        isGrid={true}
        alignment={alignment}
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
            i18nStrings={i18nStrings}
            disabled={file.disabled}
            loading={file.loading}
            alignment={alignment}
            groupContainsImage={groupContainsImage}
            index={fileIndex}
          />
        )}
        limit={limit}
        i18nStrings={{
          limitShowFewer: i18nStrings.limitShowFewer,
          limitShowMore: i18nStrings.limitShowMore,
        }}
      />
    </div>
  );
}

export default InternalFileTokenGroup;
