// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useRef, useState } from 'react';
import { ButtonGroupProps } from './interfaces.js';
import { ButtonProps } from '../button/interfaces.js';
import { ClickDetail, fireCancelableEvent } from '../internal/events/index.js';
import IconButtonItem from './icon-button-item.js';
import MenuDropdownItem from './menu-dropdown-item.js';
import Tooltip from './tooltip/index.js';
import LiveRegion from '../internal/components/live-region/index.js';
import StatusIndicator from '../status-indicator/internal.js';
import styles from './styles.css.js';

const ItemElement = forwardRef(
  (
    {
      item,
      onItemClick,
      dropdownExpandToViewport,
    }: {
      item: ButtonGroupProps.IconButton | ButtonGroupProps.MenuDropdown;
      onItemClick?: (event: CustomEvent) => void;
      dropdownExpandToViewport?: boolean;
    },
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [clickIdx, setClickIdx] = useState(0);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [isActionPopover, setIsActionPopover] = useState(false);

    const onClickHandler = (event: CustomEvent<ClickDetail>) => {
      setClickIdx(idx => idx + 1);

      if ('actionPopoverText' in item && item.actionPopoverText) {
        setIsActionPopover(true);
        setPopoverOpen(true);
      } else {
        setPopoverOpen(false);
      }

      fireCancelableEvent(onItemClick, { id: item.id }, event);
    };

    const showTooltip = () => {
      if (!popoverOpen) {
        setIsActionPopover(false);
        setPopoverOpen(true);
      }
    };

    const hideTooltip = () => {
      if (!isActionPopover) {
        setPopoverOpen(false);
      }
    };

    const onPopoverClose = () => {
      setPopoverOpen(false);
      setIsActionPopover(false);
    };

    const actionPopoverText = 'actionPopoverText' in item && item.actionPopoverText;

    return (
      <div
        ref={buttonRef}
        onPointerEnter={showTooltip}
        onPointerLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={styles['item-wrapper']}
      >
        {item.type === 'icon-button' ? (
          <IconButtonItem ref={ref} item={item} onItemClick={onClickHandler} />
        ) : (
          <MenuDropdownItem
            ref={ref}
            item={item}
            onItemClick={onItemClick}
            dropdownExpandToViewport={dropdownExpandToViewport}
          />
        )}
        <Tooltip
          trackRef={buttonRef}
          trackKey={item.id}
          open={popoverOpen}
          close={onPopoverClose}
          content={
            (isActionPopover && actionPopoverText && (
              <StatusIndicator type="success">{item.actionPopoverText}</StatusIndicator>
            )) ||
            item.text
          }
        />
        {popoverOpen && <LiveRegion key={clickIdx}>{isActionPopover && actionPopoverText}</LiveRegion>}
      </div>
    );
  }
);

export default ItemElement;
