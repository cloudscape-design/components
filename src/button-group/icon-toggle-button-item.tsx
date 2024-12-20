// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { ButtonProps } from '../button/interfaces.js';
import Tooltip from '../internal/components/tooltip/index.js';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events/index.js';
import InternalLiveRegion from '../live-region/internal.js';
import { InternalToggleButton } from '../toggle-button/internal.js';
import { ButtonGroupProps } from './interfaces.js';

import testUtilStyles from './test-classes/styles.css.js';

const IconToggleButtonItem = forwardRef(
  (
    {
      item,
      showTooltip,
      showFeedback,
      onItemClick,
    }: {
      item: ButtonGroupProps.IconToggleButton;
      showTooltip: boolean;
      showFeedback: boolean;
      onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
    },
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

    const feedbackContent = item.pressed ? item.pressedPopoverFeedback ?? item.popoverFeedback : item.popoverFeedback;
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
          __title=""
        >
          {item.text}
        </InternalToggleButton>
        {(canShowTooltip || canShowFeedback) && (
          <Tooltip
            trackRef={containerRef}
            trackKey={item.id}
            value={
              (showFeedback && <InternalLiveRegion tagName="span">{feedbackContent}</InternalLiveRegion>) || item.text
            }
            className={clsx(testUtilStyles.tooltip, testUtilStyles['button-group-tooltip'])}
          />
        )}
      </div>
    );
  }
);

export default IconToggleButtonItem;
