// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import { ButtonGroupProps, ItemProps } from '../interfaces.js';
import { InternalButton } from '../../button/internal.js';
import { ClickDetail, fireCancelableEvent } from '../../internal/events/index.js';
import Tooltip from '../tooltip/index.js';
import styles from './styles.css.js';
import StatusIndicator from '../../status-indicator/internal.js';

export default function ItemElement({ item, onItemClick }: ItemProps) {
  if (item.type === 'divider') {
    return <DividerItemElement />;
  } else if (item.type === 'button') {
    return <ButtonItemElement item={item} onItemClick={onItemClick} />;
  }

  throw new Error('Unsupported item type.');
}

function DividerItemElement() {
  return <div className={styles.divider} />;
}

function ButtonItemElement({
  item,
  onItemClick,
}: {
  item: ButtonGroupProps.Button;
  onItemClick?: (event: CustomEvent) => void;
}) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isActionPopover, setIsActionPopover] = useState(false);

  const onClickHandler = (event: CustomEvent<ClickDetail>) => {
    setIsActionPopover(true);
    setPopoverOpen(true);

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
          item.text
        }
      />
    </div>
  );
}
