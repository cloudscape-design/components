// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';

import { FileInputProps } from '../file-input/interfaces.js';
import InternalFileInput from '../file-input/internal.js';
import Tooltip from '../internal/components/tooltip/index.js';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events/index.js';
import { ButtonGroupProps } from './interfaces.js';

import testUtilStyles from './test-classes/styles.css.js';

const FileInputItem = forwardRef(
  (
    {
      item,
      showTooltip,
      onFilesChange,
    }: {
      item: ButtonGroupProps.IconFileInput;
      showTooltip: boolean;
      onFilesChange?: CancelableEventHandler<ButtonGroupProps.FilesChangeDetails>;
    },
    ref: React.Ref<FileInputProps.Ref>
  ) => {
    const [files, setFiles] = useState<File[]>([]);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const canShowTooltip = Boolean(showTooltip);

    return (
      <div ref={containerRef}>
        <InternalFileInput
          className={clsx(testUtilStyles['button-group-item'])}
          ref={ref}
          variant="icon"
          ariaLabel={item.text}
          accept={item.accept}
          multiple={item.multiple}
          value={files}
          onChange={event => {
            fireCancelableEvent(onFilesChange, { id: item.id, files: event.detail.value });
            setFiles(event.detail.value);
          }}
          data-testid={item.id}
          __inputNativeAttributes={{
            'data-itemid': item.id,
          }}
          __inputClassName={testUtilStyles.item}
        />
        {canShowTooltip && (
          <Tooltip
            trackRef={containerRef}
            trackKey={item.id}
            value={item.text}
            className={clsx(testUtilStyles.tooltip, testUtilStyles['button-group-tooltip'])}
          />
        )}
      </div>
    );
  }
);

export default FileInputItem;
