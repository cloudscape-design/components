// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { ButtonGroupProps } from './interfaces.js';
import { ButtonProps } from '../button/interfaces.js';
import { ClickDetail, fireCancelableEvent } from '../internal/events/index.js';
import IconButtonItem from './icon-button-item.js';
import MenuDropdownItem from './menu-dropdown-item.js';
import Tooltip from '../internal/components/tooltip/index.js';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';
import LiveRegion from '../internal/components/live-region/index.js';
import clsx from 'clsx';

const ItemElement = forwardRef(
  (
    {
      item,
      onItemClick,
    }: {
      item: ButtonGroupProps.Item;
      onItemClick?: (event: CustomEvent) => void;
    },
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const popoverFeedback = 'popoverFeedback' in item && item.popoverFeedback;
    const isIconButton = item.type === 'icon-button';
    const isMenuDropdown = item.type === 'menu-dropdown';

    const onClickHandler = (event: CustomEvent<ClickDetail>) => {
      if (popoverFeedback) {
        setShowFeedback(true);
        setShowTooltip(true);
      } else {
        setShowTooltip(false);
      }

      fireCancelableEvent(onItemClick, { id: item.id }, event);
    };

    const onShowTooltip = () => {
      if (!showTooltip) {
        setShowFeedback(false);
        setShowTooltip(true);
      }
    };

    const onHideTooltip = () => {
      if (!showFeedback) {
        setShowTooltip(false);
      }
    };

    useEffect(() => {
      if (!showTooltip) {
        return;
      }

      const close = () => {
        setShowTooltip(false);
        setShowFeedback(false);
      };

      const currentRef = buttonRef.current;
      const handlePointerDownEvent = (event: PointerEvent) => {
        if (event.target && currentRef && currentRef.contains(event.target as HTMLElement)) {
          return;
        }

        close();
      };

      const handleKeyDownEvent = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          close();
        }
      };

      const handleTooltipToogleEvent = (event: CustomEvent) => {
        if (event.detail.trackKey !== item.id && event.detail.open) {
          close();
        }
      };

      window.addEventListener('pointerdown', handlePointerDownEvent);
      window.addEventListener('keydown', handleKeyDownEvent);
      window.addEventListener('btngroup-tooltip:toggle', handleTooltipToogleEvent as any);

      return () => {
        window.removeEventListener('pointerdown', handlePointerDownEvent);
        window.removeEventListener('keydown', handleKeyDownEvent);
        window.removeEventListener('btngroup-tooltip:toggle', handleTooltipToogleEvent as any);
      };
    }, [item.id, showTooltip, setShowTooltip, setShowFeedback]);

    useEffect(() => {
      window.dispatchEvent(
        new CustomEvent('btngroup-tooltip:toggle', { detail: { open: showTooltip, trackKey: item.id } })
      );
    }, [showTooltip, item.id]);

    return (
      <div
        ref={buttonRef}
        onPointerEnter={onShowTooltip}
        onPointerLeave={onHideTooltip}
        onFocus={onShowTooltip}
        onBlur={onHideTooltip}
        className={styles['item-wrapper']}
      >
        {isIconButton && <IconButtonItem ref={ref} item={item} onItemClick={onClickHandler} />}
        {isMenuDropdown && (
          <MenuDropdownItem ref={ref} item={item} onItemClick={onItemClick} expandToViewport={item.expandToViewport} />
        )}
        {showTooltip && !isMenuDropdown && (
          <Tooltip
            trackRef={buttonRef}
            trackKey={item.id}
            value={(showFeedback && <LiveRegion visible={true}>{popoverFeedback}</LiveRegion>) || item.text}
            className={clsx(styles.tooltip, testUtilStyles['button-group-tooltip'])}
          />
        )}
      </div>
    );
  }
);

export default ItemElement;
