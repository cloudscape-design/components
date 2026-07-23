// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../button/interfaces.js';
import { InternalButton } from '../button/internal.js';
import { fireNonCancelableEvent } from '../internal/events/index.js';
import InternalLiveRegion from '../live-region/internal.js';
import Tooltip from '../tooltip/internal.js';
import { NonCancelableEventHandler } from '../types/events';
import { ButtonGroupProps } from './interfaces.js';

import testUtilStyles from './test-classes/styles.css.js';

interface CopyToClipboardItemProps {
  item: ButtonGroupProps.IconCopyToClipboard;
  showTooltip: boolean;
  showFeedback: boolean;
  onTooltipDismiss: () => void;
  onShowFeedback: () => void;
  onCopyFailure?: NonCancelableEventHandler<ButtonGroupProps.CopyFailureDetail>;
  onCopySuccess?: NonCancelableEventHandler<ButtonGroupProps.CopySuccessDetail>;
}

const CopyToClipboardItem = forwardRef(
  (
    {
      item,
      showTooltip,
      showFeedback,
      onTooltipDismiss,
      onShowFeedback,
      onCopyFailure,
      onCopySuccess,
    }: CopyToClipboardItemProps,
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<'success' | 'error'>('success');

    const onClick = () => {
      const reportSuccess = () => {
        setStatus('success');
        onShowFeedback();
        fireNonCancelableEvent(onCopySuccess, { id: item.id, text: item.textToCopy });
      };
      const reportFailure = () => {
        setStatus('error');
        onShowFeedback();
        fireNonCancelableEvent(onCopyFailure, { id: item.id, text: item.textToCopy });
      };

      if (!navigator.clipboard) {
        reportFailure();
        return;
      }

      navigator.clipboard.writeText(item.textToCopy).then(reportSuccess, reportFailure);
    };

    const feedbackText = status === 'success' ? item.copySuccessText : item.copyErrorText;

    const canShowTooltip = Boolean(showTooltip && !item.disabled && !showFeedback);
    const canShowFeedback = Boolean(showTooltip && showFeedback && !item.disabled);

    return (
      <div ref={containerRef}>
        <InternalButton
          ref={ref}
          variant="icon"
          iconName="copy"
          ariaLabel={item.text}
          disabled={item.disabled}
          disabledReason={showFeedback ? undefined : item.disabledReason}
          __focusable={canShowFeedback}
          onClick={onClick}
          data-testid={item.id}
          data-itemid={item.id}
          className={clsx(testUtilStyles.item, testUtilStyles['button-group-item'])}
          __title=""
        />
        {(canShowTooltip || canShowFeedback) && (
          <Tooltip
            className={testUtilStyles['button-group-tooltip']}
            getTrack={() => containerRef.current}
            content={
              (canShowFeedback && <InternalLiveRegion tagName="span">{feedbackText}</InternalLiveRegion>) || item.text
            }
            onEscape={onTooltipDismiss}
          />
        )}
      </div>
    );
  }
);

export default CopyToClipboardItem;
