// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import { ButtonGroupProps } from './interfaces.js';
import { InternalButton } from '../button/internal.js';
import { ButtonProps } from '../button/interfaces.js';
import { CancelableEventHandler, ClickDetail } from '../internal/events/index.js';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';
import clsx from 'clsx';
import Tooltip from '../internal/components/tooltip/index.js';
import LiveRegion from '../internal/components/live-region/index.js';

const IconButtonItem = forwardRef(
  (
    {
      item,
      showTooltip,
      showFeedback,
      onItemClick,
    }: {
      item: ButtonGroupProps.IconButton;
      showTooltip: boolean;
      showFeedback: boolean;
      onItemClick?: CancelableEventHandler<ClickDetail>;
    },
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const hasIcon = item.iconName || item.iconUrl || item.iconSvg;

    if (!hasIcon) {
      warnOnce('ButtonGroup', `Missing icon for item with id: ${item.id}`);
    }

    return (
      <div ref={containerRef}>
        <InternalButton
          variant="icon"
          loading={item.loading}
          loadingText={item.loadingText}
          disabled={item.disabled}
          iconName={hasIcon ? item.iconName : 'close'}
          iconAlt={item.text}
          iconSvg={item.iconSvg}
          ariaLabel={item.text}
          onClick={onItemClick}
          ref={ref}
          data-testid={item.id}
          className={clsx(styles.item, testUtilStyles['button-group-item'])}
          __title=""
        >
          {item.text}
        </InternalButton>
        {showTooltip && !item.disabled && (!showFeedback || item.popoverFeedback) && (
          <Tooltip
            trackRef={containerRef}
            trackKey={item.id}
            value={(showFeedback && <LiveRegion visible={true}>{item.popoverFeedback}</LiveRegion>) || item.text}
            className={clsx(styles.tooltip, testUtilStyles['button-group-tooltip'])}
          />
        )}
      </div>
    );
  }
);

export default IconButtonItem;
