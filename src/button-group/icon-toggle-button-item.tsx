// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { ButtonProps } from '../button/interfaces.js';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events/index.js';
import InternalLiveRegion from '../live-region/internal.js';
import { InternalToggleButton } from '../toggle-button/internal.js';
import Tooltip from '../tooltip/internal.js';
import { ButtonGroupProps, InternalIconToggleButton } from './interfaces.js';

import testUtilStyles from './test-classes/styles.css.js';

interface IconToggleButtonItemProps {
  item: InternalIconToggleButton;
  showTooltip: boolean;
  showFeedback: boolean;
  onTooltipDismiss: () => void;
  onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
}

const IconToggleButtonItem = forwardRef(
  (
    { item, showTooltip, showFeedback, onTooltipDismiss, onItemClick }: IconToggleButtonItemProps,
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const hasIcon = item.iconName || item.iconUrl || item.iconSvg;
    const hasPressedIcon = item.pressedIconName || item.pressedIconUrl || item.pressedIconSvg;

    if (!hasIcon) {
      warnOnce('ButtonGroup', `Missing icon for item with id: ${item.id}`);
    }
    if (!hasPressedIcon) {
      warnOnce('ButtonGroup', `Missing pressed icon for item with id: ${item.id}`);
    }

    const feedbackContent = item.pressed ? (item.pressedPopoverFeedback ?? item.popoverFeedback) : item.popoverFeedback;
    const canShowTooltip = showTooltip && !item.disabled && !item.loading;
    const canShowFeedback = showTooltip && showFeedback && feedbackContent;
    return (
      <div ref={containerRef}>
        <InternalToggleButton
          variant="icon"
          pressed={item.pressed}
          loading={item.loading}
          loadingText={item.loadingText}
          disabled={item.disabled}
          disabledReason={showFeedback ? undefined : item.disabledReason} // don't show disabled reason when popover feedback is shown
          iconName={hasIcon ? item.iconName : 'close'}
          iconUrl={item.iconUrl}
          iconSvg={item.iconSvg}
          pressedIconName={hasIcon ? item.pressedIconName : 'close'}
          pressedIconUrl={item.pressedIconUrl}
          pressedIconSvg={item.pressedIconUrl}
          ariaLabel={item.text}
          onChange={event => fireCancelableEvent(onItemClick, { id: item.id, pressed: event.detail.pressed })}
          ref={ref}
          data-testid={item.id}
          data-itemid={item.id}
          className={clsx(testUtilStyles.item, testUtilStyles['button-group-item'])}
          analyticsAction={item.analyticsAction}
          __title=""
        >
          {item.text}
        </InternalToggleButton>
        {(canShowTooltip || canShowFeedback) && (
          <Tooltip
            className={testUtilStyles['button-group-tooltip']}
            getTrack={() => containerRef.current}
            content={
              (showFeedback && <InternalLiveRegion tagName="span">{feedbackContent}</InternalLiveRegion>) || item.text
            }
            onEscape={onTooltipDismiss}
          />
        )}
      </div>
    );
  }
);

export default IconToggleButtonItem;
