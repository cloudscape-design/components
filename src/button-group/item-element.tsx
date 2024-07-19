// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useEffect } from 'react';
import { ButtonGroupProps } from './interfaces.js';
import { ClickDetail, fireCancelableEvent, NonCancelableEventHandler } from '../internal/events/index.js';
import IconButtonItem from './icon-button-item.js';
import MenuDropdownItem from './menu-dropdown-item.js';
import styles from './styles.css.js';

const ItemElement = forwardRef(
  (
    {
      item,
      tooltipItemId,
      isFeedbackTooltip,
      dropdownExpandToViewport,
      setTooltipItemId,
      setIsFeedbackTooltip,
      onItemClick,
    }: {
      item: ButtonGroupProps.Item;
      tooltipItemId: string | null;
      isFeedbackTooltip: boolean;
      dropdownExpandToViewport?: boolean;
      setTooltipItemId: (id: string | null) => void;
      setIsFeedbackTooltip: (isFeedbackTooltip: boolean) => void;
      onItemClick?: NonCancelableEventHandler<ButtonGroupProps.ItemClickDetails> | undefined;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      return () => {
        if (item.id === tooltipItemId) {
          setTooltipItemId(null);
          setIsFeedbackTooltip(false);
        }
      };
    }, [item.id, setIsFeedbackTooltip, setTooltipItemId, tooltipItemId]);

    useEffect(() => {
      if (!tooltipItemId || tooltipItemId !== item.id) {
        return;
      }

      const close = () => {
        setTooltipItemId(null);
        setIsFeedbackTooltip(false);
      };

      const handlePointerDownEvent = (event: PointerEvent) => {
        if (event.target && containerRef.current?.contains(event.target as HTMLElement)) {
          return;
        }

        close();
      };

      const handleKeyDownEvent = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          close();
        }
      };

      window.addEventListener('pointerdown', handlePointerDownEvent);
      window.addEventListener('keydown', handleKeyDownEvent);

      return () => {
        window.removeEventListener('pointerdown', handlePointerDownEvent);
        window.removeEventListener('keydown', handleKeyDownEvent);
      };
    }, [item.id, setIsFeedbackTooltip, setTooltipItemId, tooltipItemId]);

    const onShowTooltip = (show: boolean) => {
      if (isFeedbackTooltip && tooltipItemId) {
        return;
      }

      if (tooltipItemId !== item.id) {
        if (show) {
          setTooltipItemId(item.id);
        }
      } else {
        if (!show) {
          setTooltipItemId(null);
        }
      }

      setIsFeedbackTooltip(false);
    };

    const onClickHandler = (event: CustomEvent<ButtonGroupProps.ItemClickDetails | ClickDetail>) => {
      const popoverFeedback = 'popoverFeedback' in item && item.popoverFeedback;

      if (popoverFeedback) {
        setTooltipItemId(item.id);
        setIsFeedbackTooltip(true);
      } else {
        setTooltipItemId(null);
        setIsFeedbackTooltip(false);
      }

      fireCancelableEvent(onItemClick, { id: 'id' in event.detail ? event.detail.id : item.id }, event);
    };

    return (
      <div
        key={item.id}
        className={styles['item-wrapper']}
        ref={containerRef}
        onPointerEnter={() => onShowTooltip(true)}
        onPointerLeave={() => onShowTooltip(false)}
        onFocus={() => onShowTooltip(true)}
        onBlur={() => onShowTooltip(false)}
      >
        {item.type === 'icon-button' && (
          <IconButtonItem
            ref={ref}
            item={item}
            onItemClick={onClickHandler}
            tooltipItemId={tooltipItemId}
            isFeedbackTooltip={isFeedbackTooltip}
          />
        )}
        {item.type === 'menu-dropdown' && (
          <MenuDropdownItem
            ref={ref}
            item={item}
            tooltipItemId={tooltipItemId}
            onItemClick={onClickHandler}
            expandToViewport={dropdownExpandToViewport}
          />
        )}
      </div>
    );
  }
);

export default ItemElement;
