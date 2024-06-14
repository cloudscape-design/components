// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState, forwardRef } from 'react';
import { ButtonGroupProps } from './interfaces.js';
import { InternalButton } from '../button/internal.js';
import { ClickDetail, fireCancelableEvent } from '../internal/events/index.js';
import { ButtonProps } from '../button/interfaces.js';
import Tooltip from './tooltip/index.js';
import StatusIndicator from '../status-indicator/internal.js';
import styles from './styles.css.js';

const IconButtonItem = forwardRef(
  (
    {
      item,
      onItemClick,
    }: {
      item: ButtonGroupProps.IconButton;
      onItemClick?: (event: CustomEvent) => void;
    },
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [isActionPopover, setIsActionPopover] = useState(false);
    const hasIcon = item.iconName || item.iconUrl || item.iconSvg;

    const onClickHandler = (event: CustomEvent<ClickDetail>) => {
      if (item.actionPopoverText) {
        setIsActionPopover(true);
        setPopoverOpen(true);
      } else {
        setPopoverOpen(false);
      }

      if (onItemClick) {
        fireCancelableEvent(onItemClick, { id: item.id }, event);
      }
    };

    const onPointerEnter = () => {
      if (!popoverOpen) {
        setIsActionPopover(false);
        setPopoverOpen(true);
      }
    };

    const onPointerLeave = () => {
      if (!isActionPopover) {
        setPopoverOpen(false);
      }
    };

    const onPopoverClose = () => {
      setPopoverOpen(false);
      setIsActionPopover(false);
    };

    return (
      <div ref={buttonRef} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
        <InternalButton
          variant="icon"
          loading={item.loading}
          loadingText={item.loadingText}
          disabled={item.disabled}
          iconName={hasIcon ? item.iconName : 'close'}
          iconAlt={item.text}
          iconSvg={item.iconSvg}
          ariaLabel={item.text}
          onClick={event => onClickHandler(event)}
          ref={ref}
          data-testid={item.id}
          className={styles.item}
        >
          {item.text}
        </InternalButton>
        <Tooltip
          trackRef={buttonRef}
          trackKey={item.id}
          open={popoverOpen}
          close={onPopoverClose}
          content={
            (isActionPopover && item.actionPopoverText && (
              <StatusIndicator type="success">{item.actionPopoverText}</StatusIndicator>
            )) ||
            item.text
          }
        />
      </div>
    );
  }
);

export default IconButtonItem;