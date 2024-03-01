// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import { useMergeRefs } from '../../hooks/use-merge-refs';
import React, { useEffect, useRef } from 'react';
import { BaseComponentProps, getBaseProps } from '../../base-component';
import {
  fireNonCancelableEvent,
  NonCancelableEventHandler,
  CancelableEventHandler,
  BaseKeyDetail,
  fireKeyboardEvent,
} from '../../events';
import { findUpUntil } from '../../utils/dom';
import styles from './styles.css.js';
import { DropdownStatusProps } from '../dropdown-status';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

export interface OptionsListProps extends BaseComponentProps {
  open?: boolean;
  statusType: DropdownStatusProps.StatusType;
  /**
   * Options list
   */
  children: React.ReactNode;
  nativeAttributes?: Record<string, any>;
  /**
   * Called when more items need to be loaded.
   */
  onLoadMore?: NonCancelableEventHandler;
  onKeyDown?: CancelableEventHandler<BaseKeyDetail>;
  onBlur?: NonCancelableEventHandler<{ relatedTarget: Node | null }>;
  onFocus?: NonCancelableEventHandler;
  onMouseUp?: (itemIndex: number) => void;
  onMouseMove?: (itemIndex: number) => void;
  position?: React.CSSProperties['position'];
  role?: 'listbox' | 'list' | 'menu';
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  decreaseBlockMargin?: boolean;
}

const BOTTOM_TRIGGER_OFFSET = 80;

const getItemIndex = (containerRef: React.RefObject<HTMLElement>, event: React.MouseEvent) => {
  const target = findUpUntil(
    event.target as HTMLElement,
    element => element === containerRef.current || !!element.dataset.mouseTarget
  );
  const mouseTarget = target?.dataset.mouseTarget;
  return mouseTarget ? parseInt(mouseTarget) : -1;
};

const OptionsList = (
  {
    open,
    statusType,
    children,
    nativeAttributes = {},
    onKeyDown,
    onBlur,
    onFocus,
    onLoadMore,
    onMouseUp,
    onMouseMove,
    position = 'relative',
    role = 'listbox',
    decreaseBlockMargin = false,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ...restProps
  }: OptionsListProps,
  ref: React.Ref<HTMLUListElement>
) => {
  const baseProps = getBaseProps(restProps);
  const menuRef = useRef<HTMLUListElement>(null);

  const handleScroll = useStableCallback(() => {
    const scrollContainer = menuRef?.current;
    if (scrollContainer) {
      const bottomEdgePosition = scrollContainer.scrollTop + scrollContainer.clientHeight;
      const remainingScrollHeight = scrollContainer.scrollHeight - bottomEdgePosition;
      if (remainingScrollHeight < BOTTOM_TRIGGER_OFFSET) {
        fireNonCancelableEvent(onLoadMore);
      }
    }
  });

  useEffect(() => {
    if (open && statusType === 'pending') {
      handleScroll();
    }
  }, [open, statusType, handleScroll]);

  const className = clsx(styles['options-list'], {
    [styles['decrease-block-margin']]: decreaseBlockMargin,
  });

  const mergedRef = useMergeRefs(ref, menuRef);

  return (
    <ul
      {...baseProps}
      {...nativeAttributes}
      className={className}
      ref={mergedRef}
      style={{ position }}
      role={role}
      onScroll={handleScroll}
      onKeyDown={event => onKeyDown && fireKeyboardEvent(onKeyDown, event)}
      onMouseMove={event => onMouseMove?.(getItemIndex(menuRef, event))}
      onMouseUp={event => onMouseUp?.(getItemIndex(menuRef, event))}
      onBlur={event => fireNonCancelableEvent(onBlur, { relatedTarget: event.relatedTarget })}
      onFocus={() => fireNonCancelableEvent(onFocus)}
      tabIndex={-1}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
    >
      {open && children}
    </ul>
  );
};

export default React.forwardRef(OptionsList);
