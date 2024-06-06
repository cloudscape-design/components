// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import { ButtonGroupProps } from './interfaces';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events';
import { findItemById, getFirstLoadingItem, isItemGroup, toDropdownItems } from './utils';
import ButtonDropdown from '../button-dropdown/internal';
import Tooltip from './tooltip';
import StatusIndicator from '../status-indicator/internal';
import styles from './styles.css.js';

const MoreItems = React.forwardRef(
  (
    {
      items,
      onItemClick,
      dropdownExpandToViewport,
      ariaLabel,
    }: {
      items: ButtonGroupProps.ItemOrGroup[];
      onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
      dropdownExpandToViewport?: boolean;
      ariaLabel?: string;
    },
    ref: React.Ref<ButtonDropdownProps.Ref>
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverText, setPopoverText] = useState('');
    const dropdownItems = toDropdownItems(items);
    const loadingItem = getFirstLoadingItem(items);

    const onClickHandler = (event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => {
      const itemId = event.detail.id;
      setPopoverText('');

      const item = findItemById(items, itemId);
      if (item && item.actionPopoverText) {
        setPopoverText(item.actionPopoverText);
        setPopoverOpen(true);
      }

      if (onItemClick) {
        fireCancelableEvent(onItemClick, { id: itemId }, event);
      }
    };

    const onPopoverClose = () => {
      setPopoverOpen(false);
    };

    const onPointerDown = () => {
      setPopoverOpen(false);
    };

    const trackKey = items.map(item => (!isItemGroup(item) ? item.id : '')).join('-');

    return (
      <div ref={containerRef} onPointerDown={onPointerDown}>
        <ButtonDropdown
          variant="icon"
          loading={loadingItem?.loading}
          loadingText={loadingItem?.loadingText}
          mainAction={{ iconName: 'ellipsis', text: 'More' }}
          items={dropdownItems}
          onItemClick={(event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => onClickHandler(event)}
          expandToViewport={dropdownExpandToViewport}
          ref={ref}
          ariaLabel={ariaLabel}
          className={styles['more-button']}
        />
        <Tooltip
          trackRef={containerRef}
          trackKey={trackKey}
          open={popoverOpen && popoverText.length > 0}
          close={onPopoverClose}
          content={<StatusIndicator type="success">{popoverText}</StatusIndicator>}
        />
      </div>
    );
  }
);

export default MoreItems;
