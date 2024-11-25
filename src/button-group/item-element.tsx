// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { ButtonProps } from '../button/interfaces.js';
import { fireCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { nodeBelongs } from '../internal/utils/node-belongs';
import FileInputItem from './file-input-item';
import IconButtonItem from './icon-button-item';
import IconToggleButtonItem from './icon-toggle-button-item.js';
import { ButtonGroupProps } from './interfaces';
import MenuDropdownItem from './menu-dropdown-item';

import styles from './styles.css.js';

interface ItemElementProps {
  item: ButtonGroupProps.Item;
  dropdownExpandToViewport?: boolean;
  tooltip: null | { item: string; feedback: boolean };
  setTooltip: (tooltip: null | { item: string; feedback: boolean }) => void;
  onItemClick?: NonCancelableEventHandler<ButtonGroupProps.ItemClickDetails> | undefined;
  onFilesChange?: NonCancelableEventHandler<ButtonGroupProps.FileChangeDetails> | undefined;
}

const ItemElement = forwardRef(
  (
    { item, dropdownExpandToViewport, tooltip, setTooltip, onItemClick, onFilesChange }: ItemElementProps,
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

    const onShowTooltipHard = (show: boolean) => {
      if (!show && item.id !== tooltip?.item) {
        return;
      }

      setTooltip(show ? { item: item.id, feedback: false } : null);
    };

    const onClickHandler = (event: CustomEvent<ButtonGroupProps.ItemClickDetails>) => {
      const hasPopoverFeedback = 'popoverFeedback' in item && item.popoverFeedback;

      if (hasPopoverFeedback) {
        setTooltip({ item: item.id, feedback: true });
      }

      fireCancelableEvent(onItemClick, event.detail, event);
    };

    const onFilesChangeHandler = (event: CustomEvent<ButtonGroupProps.FileChangeDetails>) => {
      fireCancelableEvent(onFilesChange, event.detail, event);
    };

    return (
      <div
        key={item.id}
        className={styles['item-wrapper']}
        ref={containerRef}
        onPointerEnter={() => onShowTooltipSoft(true)}
        onPointerLeave={() => onShowTooltipSoft(false)}
        onFocus={event => {
          // Showing no tooltip when the focus comes from inside the container.
          // This is needed to prevent the tooltip after a menu closes with item selection or Escape.
          if (event && event.relatedTarget && nodeBelongs(containerRef.current, event.relatedTarget)) {
            return;
          }
          onShowTooltipHard(true);
        }}
        onBlur={() => onShowTooltipHard(false)}
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
        {item.type === 'icon-toggle-button' && (
          <IconToggleButtonItem
            ref={buttonRef}
            item={item}
            onItemClick={onClickHandler}
            showTooltip={tooltip?.item === item.id}
            showFeedback={!!tooltip?.feedback}
          />
        )}
        {item.type === 'file-input' && (
          <FileInputItem
            ref={buttonRef}
            item={item}
            onFilesChange={onFilesChangeHandler}
            showTooltip={tooltip?.item === item.id}
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
