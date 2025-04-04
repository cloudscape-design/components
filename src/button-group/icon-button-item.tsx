// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { ButtonProps } from '../button/interfaces.js';
import { InternalButton } from '../button/internal.js';
import Tooltip from '../internal/components/tooltip/index.js';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events/index.js';
import InternalLiveRegion from '../live-region/internal.js';
import { ButtonGroupProps } from './interfaces.js';

import testUtilStyles from './test-classes/styles.css.js';

interface IconButtonItemProps {
  item: ButtonGroupProps.IconButton;
  showTooltip: boolean;
  showFeedback: boolean;
  onTooltipDismiss: () => void;
  onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
}

const IconButtonItem = forwardRef(
  (
    { item, showTooltip, showFeedback, onTooltipDismiss, onItemClick }: IconButtonItemProps,
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const hasIcon = item.iconName || item.iconUrl || item.iconSvg;

    if (!hasIcon) {
      warnOnce('ButtonGroup', `Missing icon for item with id: ${item.id}`);
    }

    const canShowTooltip = Boolean(showTooltip && !item.disabled && !item.loading);
    const canShowFeedback = Boolean(showTooltip && showFeedback && item.popoverFeedback);
    return (
      <div ref={containerRef}>
        <InternalButton
          variant="icon"
          loading={item.loading}
          loadingText={item.loadingText}
          disabled={item.disabled}
          disabledReason={showFeedback ? undefined : item.disabledReason} // don't show disabled reason when popover feedback is shown
          __focusable={canShowFeedback}
          iconName={hasIcon ? item.iconName : 'close'}
          iconUrl={item.iconUrl}
          iconSvg={item.iconSvg}
          iconAlt={item.text}
          ariaLabel={item.text}
          onClick={event => fireCancelableEvent(onItemClick, { id: item.id }, event)}
          ref={ref}
          data-testid={item.id}
          data-itemid={item.id}
          className={clsx(testUtilStyles.item, testUtilStyles['button-group-item'])}
          __title=""
        >
          {item.text}
        </InternalButton>
        {(canShowTooltip || canShowFeedback) && (
          <Tooltip
            trackRef={containerRef}
            trackKey={item.id}
            value={
              (showFeedback && <InternalLiveRegion tagName="span">{item.popoverFeedback}</InternalLiveRegion>) ||
              item.text
            }
            className={clsx(testUtilStyles.tooltip, testUtilStyles['button-group-tooltip'])}
            onDismiss={onTooltipDismiss}
          />
        )}
      </div>
    );
  }
);

export default IconButtonItem;
