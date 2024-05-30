// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import { ButtonGroupProps, ItemProps } from '../interfaces.js';
import { InternalButton } from '../../button/internal.js';
import { ClickDetail, fireCancelableEvent } from '../../internal/events/index.js';
import Tooltip from '../tooltip/index.js';
import styles from './styles.css.js';
import StatusIndicator from '../../status-indicator/internal.js';
import { ButtonProps } from '@cloudscape-design/components';

const ItemElement = React.forwardRef(({ item, onItemClick }: ItemProps, ref: React.Ref<ButtonProps.Ref>) => {
  if (item.type === 'divider') {
    return <DividerItemElement />;
  } else if (item.type === 'button') {
    return <ButtonItemElement item={item} onItemClick={onItemClick} ref={ref} />;
  }

  throw new Error('Unsupported item type.');
});

const DividerItemElement = () => {
  return <div className={styles.divider} />;
};

const ButtonItemElement = React.forwardRef(
  (
    { item, onItemClick }: { item: ButtonGroupProps.Button; onItemClick?: (event: CustomEvent) => void },
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [isActionPopover, setIsActionPopover] = useState(false);

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
          variant={item.variant}
          disabled={item.disabled}
          iconName={item.iconName}
          iconAlt={item.text}
          iconSvg={item.iconSvg}
          ariaLabel={item.text}
          onClick={event => onClickHandler(event)}
          ref={ref}
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
              <StatusIndicator type={'success'}>{item.actionPopoverText}</StatusIndicator>
            )) ||
            (!item.tooltipDisabled && item.text)
          }
        />
      </div>
    );
  }
);

export default ItemElement;
