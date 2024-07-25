// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { ButtonProps } from '../button/interfaces.js';
import { ClickDetail, fireCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import IconButtonItem from './icon-button-item.js';
import { ButtonGroupProps } from './interfaces.js';
import MenuDropdownItem from './menu-dropdown-item.js';

import styles from './styles.css.js';

const ItemElement = forwardRef(
  (
    {
      item,
      dropdownExpandToViewport,
      tooltip,
      setTooltip,
      onItemClick,
    }: {
      item: ButtonGroupProps.Item;
      dropdownExpandToViewport?: boolean;
      tooltip: null | { item: string; feedback: boolean };
      setTooltip: (tooltip: null | { item: string; feedback: boolean }) => void;
      onItemClick?: NonCancelableEventHandler<ButtonGroupProps.ItemClickDetails> | undefined;
    },
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        buttonRef.current?.focus();
      },
    }));

    useEffect(() => {
      if (tooltip?.item !== item.id) {
        return;
      }

      const close = () => {
        setTooltip(null);
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
    }, [item.id, tooltip, setTooltip]);

    const onShowTooltipSoft = (show: boolean) => {
      if (!tooltip?.feedback) {
        setTooltip(show ? { item: item.id, feedback: false } : null);
      }
    };

    const onClickHandler = (event: CustomEvent<ButtonGroupProps.ItemClickDetails | ClickDetail>) => {
      const popoverFeedback = 'popoverFeedback' in item && item.popoverFeedback;

      if (popoverFeedback) {
        setTooltip({ item: item.id, feedback: true });
      }

      fireCancelableEvent(onItemClick, { id: 'id' in event.detail ? event.detail.id : item.id }, event);
    };

    return (
      <div
        key={item.id}
        className={styles['item-wrapper']}
        ref={containerRef}
        onPointerEnter={() => onShowTooltipSoft(true)}
        onPointerLeave={() => onShowTooltipSoft(false)}
      >
        {item.type === 'icon-button' && (
          <IconButtonItem
            ref={buttonRef}
            item={item}
            onItemClick={onClickHandler}
            showTooltip={tooltip?.item === item.id}
            showFeedback={!!tooltip?.feedback}
          />
        )}
        {item.type === 'menu-dropdown' && (
          <MenuDropdownItem
            ref={buttonRef}
            item={item}
            showTooltip={tooltip?.item === item.id}
            onItemClick={onClickHandler}
            expandToViewport={dropdownExpandToViewport}
          />
        )}
      </div>
    );
  }
);

export default ItemElement;
