// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import styles from './styles.css.js';
import clsx from 'clsx';
import { useMergeRefs } from '../../hooks/use-merge-refs';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { fireNonCancelableEvent } from '../../events';
import { DropdownProps } from './interfaces';
import { DropdownPosition, InteriorDropdownPosition, calculatePosition } from './dropdown-fit-handler';
import { Transition, TransitionStatus } from '../transition';
import { useVisualRefresh } from '../../hooks/use-visual-mode';
import { usePortalModeClasses } from '../../hooks/use-portal-mode-classes';
import { DropdownContextProvider, DropdownContextProviderProps } from './context';
import { useMobile } from '../../hooks/use-mobile';
import TabTrap from '../tab-trap/index.js';
import { getFirstFocusable, getLastFocusable } from '../focus-lock/utils.js';

interface DropdownContainerProps {
  children?: React.ReactNode;
  renderWithPortal?: boolean;
  id?: string;
  open?: boolean;
}

const DropdownContainer = ({ children, renderWithPortal = false, id, open }: DropdownContainerProps) => {
  if (renderWithPortal) {
    if (open) {
      return createPortal(<div id={id}>{children}</div>, document.body);
    } else {
      return null;
    }
  } else {
    return <>{children}</>;
  }
};

interface TransitionContentProps {
  state: TransitionStatus;
  transitionRef: React.MutableRefObject<any>;
  dropdownClasses: string;
  stretchWidth: boolean;
  interior: boolean;
  isRefresh: boolean;
  dropdownRef: React.RefObject<HTMLDivElement>;
  verticalContainerRef: React.RefObject<HTMLDivElement>;
  expandToViewport?: boolean;
  header?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  position?: DropdownContextProviderProps['position'];
  open?: boolean;
  onMouseDown?: React.MouseEventHandler<Element>;
}

const TransitionContent = ({
  state,
  transitionRef,
  dropdownClasses,
  stretchWidth,
  interior,
  isRefresh,
  dropdownRef,
  verticalContainerRef,
  expandToViewport,
  header,
  children,
  footer,
  position,
  open,
  onMouseDown,
}: TransitionContentProps) => {
  const contentRef = useMergeRefs(dropdownRef, transitionRef);
  return (
    <div
      className={clsx(styles.dropdown, dropdownClasses, {
        [styles.open]: open,
        [styles['with-limited-width']]: !stretchWidth,
        [styles['hide-upper-border']]: stretchWidth,
        [styles.interior]: interior,
        [styles['is-empty']]: !header && !children,
        [styles.refresh]: isRefresh,
        [styles['use-portal']]: expandToViewport && !interior,
      })}
      ref={contentRef}
      data-open={open}
      data-animating={state !== 'exited'}
      aria-hidden={!open}
      onMouseDown={onMouseDown}
    >
      <div className={clsx(styles['dropdown-content-wrapper'], isRefresh && styles.refresh)}>
        <div className={styles['ie11-wrapper']}>
          <div ref={verticalContainerRef} className={styles['dropdown-content']}>
            <DropdownContextProvider position={position}>
              {header}
              {children}
              {footer}
            </DropdownContextProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dropdown = ({
  children,
  trigger,
  open,
  onDropdownClose,
  onMouseDown,
  header,
  footer,
  dropdownId,
  stretchTriggerHeight = false,
  stretchWidth = true,
  stretchHeight = false,
  stretchToTriggerWidth = true,
  expandToViewport = false,
  preferCenter = false,
  interior = false,
  minWidth,
  scrollable = true,
  loopFocus = expandToViewport,
  onFocus,
  onBlur,
  contentKey,
}: DropdownProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement | null>(null);
  // This container is only needed to apply max-height to. We can't move max-height to it's parent
  // because of an IE11 issue with flexbox. https://github.com/philipwalton/flexbugs/issues/216
  const verticalContainerRef = useRef<HTMLDivElement>(null);
  // To keep track of the initial position (drop up/down) which is kept the same during fixed repositioning
  const fixedPosition = useRef<DropdownPosition | null>(null);

  const isRefresh = useVisualRefresh();

  const dropdownClasses = usePortalModeClasses(triggerRef);
  const [position, setPosition] = useState<DropdownContextProviderProps['position']>('bottom-right');

  const isMobile = useMobile();

  const setDropdownPosition = (
    position: DropdownPosition | InteriorDropdownPosition,
    triggerBox: DOMRect,
    target: HTMLDivElement,
    verticalContainer: HTMLDivElement
  ) => {
    const entireWidth = !interior && stretchWidth;
    if (!stretchWidth) {
      // 1px offset for dropdowns where the dropdown itself needs a border, rather than on the items
      verticalContainer.style.maxHeight = `${parseInt(position.height) + 1}px`;
    } else {
      verticalContainer.style.maxHeight = position.height;
    }

    if (entireWidth && !expandToViewport) {
      if (stretchToTriggerWidth) {
        target.classList.add(styles['occupy-entire-width']);
      }
    } else {
      target.style.width = position.width;
    }
    // Using styles for main dropdown to adjust its position as preferred alternative
    if (position.dropUp && !interior) {
      target.classList.add(styles['dropdown-drop-up']);
      if (!expandToViewport) {
        target.style.bottom = '100%';
      }
    } else {
      target.classList.remove(styles['dropdown-drop-up']);
    }
    target.classList.add(position.dropLeft ? styles['dropdown-drop-left'] : styles['dropdown-drop-right']);

    if (position.left && position.left !== 'auto') {
      target.style.left = position.left;
    }

    // Position normal overflow dropdowns with fixed positioning relative to viewport
    if (expandToViewport && !interior) {
      target.style.position = 'fixed';
      if (position.dropUp) {
        target.style.bottom = `calc(100% - ${triggerBox.top}px)`;
      } else {
        target.style.top = `${triggerBox.bottom}px`;
      }
      if (position.dropLeft) {
        target.style.left = `calc(${triggerBox.right}px - ${position.width})`;
      } else {
        target.style.left = `${triggerBox.left}px`;
      }
      // Keep track of the initial dropdown position and direction.
      // Dropdown direction doesn't need to change as the user scrolls, just needs to stay attached to the trigger.
      fixedPosition.current = position;
      return;
    }

    // For an interior dropdown (the fly out) we need exact values for positioning
    // and classes are not enough
    // usage of relative position is impossible due to overwrite of overflow-x
    if (interior && isInteriorPosition(position)) {
      if (position.dropUp) {
        target.style.bottom = position.bottom;
      } else {
        target.style.top = position.top;
      }
      target.style.left = position.left;
    }

    if (position.dropUp && position.dropLeft) {
      setPosition('top-left');
    } else if (position.dropUp) {
      setPosition('top-right');
    } else if (position.dropLeft) {
      setPosition('bottom-left');
    } else {
      setPosition('bottom-right');
    }
  };

  const isOutsideDropdown = (element: Element) =>
    (!wrapperRef.current || !wrapperRef.current.contains(element)) &&
    (!dropdownContainerRef.current || !dropdownContainerRef.current.contains(element));

  const focusHandler = (event: React.FocusEvent) => {
    if (!event.relatedTarget || isOutsideDropdown(event.relatedTarget)) {
      fireNonCancelableEvent(onFocus, event);
    }
  };

  const blurHandler = (event: React.FocusEvent) => {
    if (!event.relatedTarget || isOutsideDropdown(event.relatedTarget)) {
      fireNonCancelableEvent(onBlur, event);
    }
  };

  useLayoutEffect(() => {
    const onDropdownOpen = () => {
      if (open && dropdownRef.current && triggerRef.current && verticalContainerRef.current) {
        // calculate scroll width only for dropdowns that has a scrollbar and ignore it for date picker components
        if (scrollable) {
          dropdownRef.current.classList.add(styles.nowrap);
        }
        setDropdownPosition(
          ...calculatePosition(
            dropdownRef.current,
            triggerRef.current,
            verticalContainerRef.current,
            interior,
            expandToViewport,
            preferCenter,
            stretchWidth,
            stretchHeight,
            isMobile,
            minWidth
          ),
          dropdownRef.current,
          verticalContainerRef.current
        );
        if (scrollable) {
          dropdownRef.current.classList.remove(styles.nowrap);
        }
      }
    };
    onDropdownOpen();

    if (open) {
      // window may scroll when dropdown opens, for example when soft keyboard shows up
      window.addEventListener('scroll', onDropdownOpen);
      // only listen to window scroll within very short time after the dropdown opens
      // do not want to interfere dropdown position on scroll afterwards
      const timeoutId = setTimeout(() => {
        window.removeEventListener('scroll', onDropdownOpen);
      }, 500);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('scroll', onDropdownOpen);
      };
    }
    // See AWSUI-13040
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dropdownRef, triggerRef, verticalContainerRef, interior, stretchWidth, isMobile, contentKey]);

  // subscribe to outside click
  useEffect(() => {
    if (!open) {
      return;
    }
    const clickListener = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) {
        fireNonCancelableEvent(onDropdownClose);
      }
    };
    window.addEventListener('click', clickListener, true);

    return () => {
      window.removeEventListener('click', clickListener, true);
    };
  }, [open, onDropdownClose]);

  // sync dropdown position on scroll and resize
  useLayoutEffect(() => {
    if (!expandToViewport || !open) {
      return;
    }
    const updateDropdownPosition = () => {
      if (triggerRef.current && dropdownRef.current && verticalContainerRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const target = dropdownRef.current;
        if (fixedPosition.current) {
          if (fixedPosition.current.dropUp) {
            dropdownRef.current.style.bottom = `calc(100% - ${triggerRect.top}px)`;
          } else {
            target.style.top = `${triggerRect.bottom}px`;
          }
          if (fixedPosition.current.dropLeft) {
            target.style.left = `calc(${triggerRect.right}px - ${fixedPosition.current.width})`;
          } else {
            target.style.left = `${triggerRect.left}px`;
          }
        }
      }
    };

    updateDropdownPosition();

    window.addEventListener('scroll', updateDropdownPosition, true);
    window.addEventListener('resize', updateDropdownPosition, true);
    return () => {
      window.removeEventListener('scroll', updateDropdownPosition, true);
      window.removeEventListener('resize', updateDropdownPosition, true);
    };
  }, [open, expandToViewport]);

  return (
    <div
      className={clsx(
        styles.root,
        interior && styles.interior,
        stretchTriggerHeight && styles['stretch-trigger-height']
      )}
      ref={wrapperRef}
      onFocus={focusHandler}
      onBlur={blurHandler}
    >
      <div className={clsx(stretchTriggerHeight && styles['stretch-trigger-height'])} ref={triggerRef}>
        {trigger}
      </div>

      <TabTrap
        focusNextCallback={() => dropdownRef.current && getFirstFocusable(dropdownRef.current)?.focus()}
        disabled={!open || !loopFocus}
      />

      <DropdownContainer renderWithPortal={expandToViewport && !interior} id={dropdownId} open={open}>
        <Transition in={open ?? false} exit={false}>
          {(state, ref) => (
            <div ref={dropdownContainerRef}>
              <TabTrap
                focusNextCallback={() => triggerRef.current && getLastFocusable(triggerRef.current)?.focus()}
                disabled={!open || !loopFocus}
              />

              <TransitionContent
                state={state}
                transitionRef={ref}
                dropdownClasses={dropdownClasses}
                open={open}
                stretchWidth={stretchWidth}
                interior={interior}
                header={header}
                expandToViewport={expandToViewport}
                footer={footer}
                onMouseDown={onMouseDown}
                isRefresh={isRefresh}
                dropdownRef={dropdownRef}
                verticalContainerRef={verticalContainerRef}
                position={position}
              >
                {children}
              </TransitionContent>

              <TabTrap
                focusNextCallback={() => triggerRef.current && getFirstFocusable(triggerRef.current)?.focus()}
                disabled={!open || !loopFocus}
              />
            </div>
          )}
        </Transition>
      </DropdownContainer>
    </div>
  );
};

const isInteriorPosition = (
  position: DropdownPosition | InteriorDropdownPosition
): position is InteriorDropdownPosition => (position as InteriorDropdownPosition).bottom !== undefined;

export default Dropdown;
