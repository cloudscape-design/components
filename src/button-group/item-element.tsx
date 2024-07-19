// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { ButtonGroupProps } from './interfaces.js';
import { ButtonProps } from '../button/interfaces.js';
import { ClickDetail, fireCancelableEvent, NonCancelableEventHandler } from '../internal/events/index.js';
import IconButtonItem from './icon-button-item.js';
import MenuDropdownItem from './menu-dropdown-item.js';
import styles from './styles.css.js';

const ItemElement = forwardRef(
  (
    {
      item,
      dropdownExpandToViewport,
      feedbackItemId,
      setFeedbackItemId,
      onItemClick,
    }: {
      item: ButtonGroupProps.Item;
      dropdownExpandToViewport?: boolean;
      feedbackItemId: string | null;
      setFeedbackItemId: (id: string | null) => void;
      onItemClick?: NonCancelableEventHandler<ButtonGroupProps.ItemClickDetails> | undefined;
    },
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [showTooltip, setShowTooltip] = React.useState(false);

    useImperativeHandle(ref, () => ({
      focus: () => {
        buttonRef.current?.focus();
      },
    }));

    useEffect(() => {
      return () => {
        if (!showTooltip) {
          return;
        }

        setShowTooltip(false);
        setFeedbackItemId(null);
      };
    }, [item.id, setFeedbackItemId, showTooltip]);

    useEffect(() => {
      if (!showTooltip) {
        return;
      }

      const close = () => {
        setShowTooltip(false);
        setFeedbackItemId(null);
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
    }, [item.id, setFeedbackItemId, showTooltip]);

    const onShowTooltip = (show: boolean) => {
      if (feedbackItemId && (feedbackItemId !== item.id || (feedbackItemId && showTooltip))) {
        return;
      }

      if (show) {
        buttonRef.current?.focus();
      }

      setShowTooltip(show);
      setFeedbackItemId(null);
    };

    const onClickHandler = (event: CustomEvent<ButtonGroupProps.ItemClickDetails | ClickDetail>) => {
      const popoverFeedback = 'popoverFeedback' in item && item.popoverFeedback;

      if (popoverFeedback) {
        setShowTooltip(true);
        setFeedbackItemId(item.id);
      } else {
        setShowTooltip(false);
        setFeedbackItemId(null);
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
            ref={buttonRef}
            item={item}
            onItemClick={onClickHandler}
            showTooltip={showTooltip}
            feedbackItemId={feedbackItemId}
          />
        )}
        {item.type === 'menu-dropdown' && (
          <MenuDropdownItem
            ref={buttonRef}
            item={item}
            showTooltip={showTooltip}
            onItemClick={onClickHandler}
            expandToViewport={dropdownExpandToViewport}
          />
        )}
      </div>
    );
  }
);

export default ItemElement;
