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
  } else if (item.type === 'icon-button') {
    return <IconButtonItemElement item={item} onItemClick={onItemClick} />;
  }

  throw new Error('Unsupported item type.');
}

function DividerItemElement() {
  return <div className={styles.divider} />;
}

function IconButtonItemElement({
  item,
  onItemClick,
}: {
  item: ButtonGroupProps.IconButton;
  onItemClick?: (event: CustomEvent) => void;
}) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [openPopover, setOpenPopover] = useState(false);
  const [isActionPopover, setIsActionPopover] = useState(false);

  const onClickHandler = (event: CustomEvent<ClickDetail>) => {
    setIsActionPopover(true);
    setOpenPopover(true);

    if (onItemClick) {
      fireCancelableEvent(onItemClick, { id: item.id }, event);
    }
  };

  const onPointerEnter = () => {
    if (!openPopover) {
      setIsActionPopover(false);
      setOpenPopover(true);
    }
  };

  const popoverContent = isActionPopover ? (
    item.actionPopoverText ? (
      <StatusIndicator type={'success'}>{item.actionPopoverText}</StatusIndicator>
    ) : null
  ) : (
    item.tooltipText ?? null
  );

  const popoverTrackKey = (isActionPopover ? item.actionPopoverText : item.tooltipText) ?? '';

  return (
    <div ref={buttonRef} onPointerEnter={onPointerEnter}>
      <InternalButton
        variant="icon"
        disabled={item.disabled}
        iconName={item.iconName}
        iconAlt={item.tooltipText}
        iconSvg={item.iconSvg}
        ariaLabel={item.text}
        onClick={event => onClickHandler(event)}
      />
      {popoverContent && (
        <Tooltip
          trackRef={buttonRef}
          trackKey={popoverTrackKey}
          value={popoverContent}
          open={openPopover}
          close={() => {
            setOpenPopover(false);
            setIsActionPopover(false);
          }}
          closeOnLeave={!isActionPopover}
        />
      )}
    </div>
  );
}
