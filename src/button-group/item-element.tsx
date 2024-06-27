// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { ButtonGroupProps } from './interfaces.js';
import { ButtonProps } from '../button/interfaces.js';
import { ClickDetail, fireCancelableEvent } from '../internal/events/index.js';
import IconButtonItem from './icon-button-item.js';
import MenuDropdownItem from './menu-dropdown-item.js';
import LiveRegion from '../internal/components/live-region/index.js';
import StatusIndicator from '../status-indicator/internal.js';
import Tooltip from '../internal/components/tooltip/index.js';
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
    const [showTooltip, setShowTooltip] = useState(false);
    const [isActionPopover, setIsActionPopover] = useState(false);

    const onClickHandler = (event: CustomEvent<ClickDetail>) => {
      setClickIdx(idx => idx + 1);

      if ('actionPopoverText' in item && item.actionPopoverText) {
        setIsActionPopover(true);
        setShowTooltip(true);
      } else {
        setShowTooltip(false);
      }

      fireCancelableEvent(onItemClick, { id: item.id }, event);
    };

    const onShowTooltip = () => {
      if (!showTooltip) {
        setIsActionPopover(false);
        setShowTooltip(true);
      }
    };

    const onHideTooltip = () => {
      if (!isActionPopover) {
        setShowTooltip(false);
      }
    };

    useEffect(() => {
      if (!showTooltip) {
        return;
      }

      const close = () => {
        setShowTooltip(false);
        setIsActionPopover(false);
      };

      const currentRef = buttonRef.current;
      const handlePointerDownEvent = (event: PointerEvent) => {
        if (event.target && currentRef && currentRef.contains(event.target as HTMLElement)) {
          return;
        }

        if (close) {
          close();
        }
      };

      const handleKeyDownEvent = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && close) {
          close();
        }
      };

      const handleTooltipToogleEvent = (event: CustomEvent) => {
        if (event.detail.trackKey !== item.id && event.detail.open && close) {
          close();
        }
      };

      window.addEventListener('pointerdown', handlePointerDownEvent);
      window.addEventListener('keydown', handleKeyDownEvent);
      window.addEventListener('tooltip:toggle', handleTooltipToogleEvent as any);

      return () => {
        window.removeEventListener('pointerdown', handlePointerDownEvent);
        window.removeEventListener('keydown', handleKeyDownEvent);
        window.removeEventListener('tooltip:toggle', handleTooltipToogleEvent as any);
      };
    }, [item.id, showTooltip]);

    useEffect(() => {
      window.dispatchEvent(new CustomEvent('tooltip:toggle', { detail: { open: showTooltip, trackKey: item.id } }));
    }, [showTooltip, item.id]);

    const actionPopoverText = 'actionPopoverText' in item && item.actionPopoverText;

    return (
      <div
        ref={buttonRef}
        onPointerEnter={onShowTooltip}
        onPointerLeave={onHideTooltip}
        onFocus={onShowTooltip}
        onBlur={onHideTooltip}
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
        {showTooltip && (
          <>
            <Tooltip
              trackRef={buttonRef}
              trackKey={item.id}
              value={
                (isActionPopover && actionPopoverText && (
                  <StatusIndicator type={item.popoverFeedbackType ?? 'success'}>
                    {item.actionPopoverText}
                  </StatusIndicator>
                )) ||
                (item.disabled && item.disabledReason ? item.disabledReason : item.text)
              }
            />
            <LiveRegion key={clickIdx}>{isActionPopover && actionPopoverText}</LiveRegion>
          </>
        )}
      </div>
    );
  }
);

export default ItemElement;
