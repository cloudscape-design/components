// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import { ButtonGroupProps } from './interfaces';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { CancelableEventHandler, fireCancelableEvent } from '../internal/events';
import ButtonDropdown from '../button-dropdown/internal';
import Tooltip from './tooltip';
import styles from './styles.css.js';

const MenuDropdownItem = React.forwardRef(
  (
    {
      item,
      onItemClick,
      dropdownExpandToViewport,
    }: {
      item: ButtonGroupProps.MenuDropdown;
      onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
      dropdownExpandToViewport?: boolean;
    },
    ref: React.Ref<ButtonDropdownProps.Ref>
  ) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [isActionPopover, setIsActionPopover] = useState(false);

    const onClickHandler = (event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => {
      fireCancelableEvent(onItemClick, { id: event.detail.id }, event);
    };

    const onPopoverClose = () => {
      setPopoverOpen(false);
    };

    const onPointerDown = () => {
      setPopoverOpen(false);
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

    return (
      <div
        ref={menuRef}
        onPointerDown={onPointerDown}
        onPointerEnter={showTooltip}
        onPointerLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={styles['item-wrapper']}
      >
        <ButtonDropdown
          ref={ref}
          variant="icon"
          loading={item.loading}
          loadingText={item?.loadingText}
          disabled={item?.disabled}
          items={item.items}
          onItemClick={(event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => onClickHandler(event)}
          expandToViewport={dropdownExpandToViewport}
          ariaLabel={item.text}
          data-testid={item.id}
          className={styles.item}
        />
        <Tooltip trackRef={menuRef} trackKey={item.id} open={popoverOpen} close={onPopoverClose} content={item.text} />
      </div>
    );
  }
);

export default MenuDropdownItem;
