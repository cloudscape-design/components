// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { FileInputProps } from '../file-input/interfaces.js';
import InternalFileInput from '../file-input/internal.js';
import Tooltip from '../internal/components/tooltip/index.js';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events/index.js';
import InternalLiveRegion from '../live-region/internal.js';
import { ButtonGroupProps } from './interfaces.js';

import testUtilStyles from './test-classes/styles.css.js';

const FileInputItem = forwardRef(
  (
    {
      item,
      showTooltip,
      showFeedback,
      onItemClick,
    }: {
      item: ButtonGroupProps.FileInput;
      showTooltip: boolean;
      showFeedback: boolean;
      onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
    },
    ref: React.Ref<FileInputProps.Ref>
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const canShowTooltip = Boolean(showTooltip);
    const canShowFeedback = Boolean(showTooltip && showFeedback && item.popoverFeedback);
    return (
      <div ref={containerRef}>
        <InternalFileInput
          variant="icon"
          ariaLabel={item.text}
          accept={item.accept}
          multiple={item.multiple}
          value={item.value}
          onChange={event => fireCancelableEvent(onItemClick, { id: item.id, files: event.detail.value })}
          ref={ref}
          data-testid={item.id}
          data-itemid={item.id}
          className={clsx(testUtilStyles.item, testUtilStyles['button-group-item'])}
        />
        {(canShowTooltip || canShowFeedback) && (
          <Tooltip
            trackRef={containerRef}
            trackKey={item.id}
            value={
              (showFeedback && <InternalLiveRegion tagName="span">{item.popoverFeedback}</InternalLiveRegion>) ||
              item.text
            }
            className={clsx(testUtilStyles.tooltip, testUtilStyles['button-group-tooltip'])}
          />
        )}
      </div>
    );
  }
);

export default FileInputItem;
