// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';

import { CopyToClipboardProps } from '../copy-to-clipboard/interfaces.js';
import InternalCopyToClipboard from '../copy-to-clipboard/internal.js';
import Tooltip from '../tooltip/internal.js';
import { NonCancelableEventHandler } from '../types/events';
import { ButtonGroupProps } from './interfaces.js';

import testUtilStyles from './test-classes/styles.css.js';

interface CopyToClipboardItemProps {
  item: ButtonGroupProps.IconCopyToClipboard;
  showTooltip: boolean;
  onTooltipDismiss: () => void;
  onCopyFailure?: NonCancelableEventHandler<CopyToClipboardProps.CopyFailureDetail>;
  onCopySuccess?: NonCancelableEventHandler<CopyToClipboardProps.CopySuccessDetail>;
}

const CopyToClipboardItem = forwardRef(
  ({ item, showTooltip, onTooltipDismiss, onCopyFailure, onCopySuccess }: CopyToClipboardItemProps) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const canShowTooltip = Boolean(showTooltip && !item.disabled);

    return (
      <div ref={containerRef}>
        <InternalCopyToClipboard
          variant="icon"
          textToCopy={item.textToCopy}
          copySuccessText={item.copySuccessText}
          copyErrorText={item.copyErrorText}
          copyButtonAriaLabel={item.text}
          disabled={item.disabled}
          disabledReason={item.disabledReason}
          data-testid={item.id}
          data-itemid={item.id}
          className={testUtilStyles['button-group-item']}
          onCopyFailure={onCopyFailure}
          onCopySuccess={onCopySuccess}
        />
        {canShowTooltip && (
          <Tooltip
            className={testUtilStyles['button-group-tooltip']}
            getTrack={() => containerRef.current}
            content={item.text}
            onEscape={onTooltipDismiss}
          />
        )}
      </div>
    );
  }
);

export default CopyToClipboardItem;
