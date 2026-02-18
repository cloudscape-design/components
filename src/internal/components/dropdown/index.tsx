// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import { useMergeRefs, useResizeObserver, useUniqueId } from '@cloudscape-design/component-toolkit/internal';
import { getLogicalBoundingClientRect } from '@cloudscape-design/component-toolkit/internal';

import { fireNonCancelableEvent } from '../../events';
import customCssProps from '../../generated/custom-css-properties';
import { useMobile } from '../../hooks/use-mobile';
import { usePortalModeClasses } from '../../hooks/use-portal-mode-classes';
import { useVisualRefresh } from '../../hooks/use-visual-mode';
import { nodeBelongs } from '../../utils/node-belongs';
import { getFirstFocusable, getLastFocusable } from '../focus-lock/utils.js';
import TabTrap from '../tab-trap/index.js';
import { Transition, TransitionStatus } from '../transition';
import { DropdownContextProvider, DropdownContextProviderProps } from './context';
import {
  calculatePosition,
  DropdownPosition,
  hasEnoughSpaceForFlexibleWidth,
  InteriorDropdownPosition,
} from './dropdown-fit-handler';
import { applyDropdownPositionRelativeToViewport, LogicalDOMRect } from './dropdown-position';
import { DropdownProps } from './interfaces';

import styles from './styles.css.js';

interface DropdownContainerProps {
  triggerRef: React.RefObject<HTMLElement>;
  children?: React.ReactNode;
  renderWithPortal: boolean;
  id?: string;
  referrerId?: string;
  open?: boolean;
}

const DropdownContainer = ({
  triggerRef,
  children,
  renderWithPortal,
  id,
  referrerId,
  open,
}: DropdownContainerProps) => {
  if (!renderWithPortal) {
    return <>{children}</>;
  }
  if (!open) {
    return null;
  }
  const currentDocument = triggerRef.current?.ownerDocument ?? document;
  return createPortal(
    <div id={id} data-awsui-referrer-id={referrerId}>
      {children}
    </div>,
    currentDocument.body
  );
};

interface TransitionContentProps {
  state: TransitionStatus;
  transitionRef: React.MutableRefObject<any>;
  dropdownClasses: string;
  matchTriggerWidth: boolean;
  hideBlockBorder: boolean;
  interior: boolean;
  isRefresh: boolean;
  dropdownRef: React.RefObject<HTMLDivElement>;
  verticalContainerRef: React.RefObject<HTMLDivElement>;
  expandToViewport?: boolean;
  minWidth?: string;
  maxWidth?: string;
  header?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  position?: DropdownContextProviderProps['position'];
  open?: boolean;
  onMouseDown?: React.MouseEventHandler<Element>;
  onFocusIn?: React.FocusEventHandler<Element>;
  onFocusOut?: React.FocusEventHandler<Element>;
  id?: string;
  role?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
}

const TransitionContent = ({
  state,
  transitionRef,
  dropdownClasses,
  matchTriggerWidth,
  hideBlockBorder,
  interior,
  isRefresh,
  dropdownRef,
  verticalContainerRef,
  expandToViewport,
  minWidth,
  maxWidth,
  header,
  content,
  footer,
  position,
  open,
  onMouseDown,
  onFocusIn,
  onFocusOut,
  id,
  role,
  ariaLabelledby,
  ariaDescribedby,
}: TransitionContentProps) => {
  const contentRef = useMergeRefs(dropdownRef, transitionRef);
  const dropdownStyles: Record<string, string> = {};
  if (minWidth) {
    dropdownStyles[customCssProps.dropdownDefaultMinWidth] = minWidth;
  }
  if (maxWidth) {
    dropdownStyles[customCssProps.dropdownDefaultMaxWidth] = maxWidth;
  }
  return (
    <div
      className={clsx(styles.dropdown, dropdownClasses, {
        [styles.open]: open,
        [styles['with-limited-width']]: !matchTriggerWidth,
        [styles['hide-block-border']]: hideBlockBorder,
        [styles.interior]: interior,
        [styles.refresh]: isRefresh,
        [styles['use-portal']]: expandToViewport && !interior,
        [styles['use-flexible-width']]: !matchTriggerWidth && !interior,
      })}
      ref={contentRef}
      id={id}
      role={role}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      data-open={open}
      data-animating={state !== 'exited'}
      aria-hidden={!open}
      style={dropdownStyles}
      onMouseDown={onMouseDown}
      onFocus={onFocusIn}
      onBlur={onFocusOut}
    >
      <div
        className={clsx(
          styles['dropdown-content-wrapper'],
          !header && !content && styles['is-empty'],
          isRefresh && styles.refresh
        )}
      >
        <div ref={verticalContainerRef} className={styles['dropdown-content']}>
          <DropdownContextProvider position={position}>
            {header}
            {content}
            {footer}
          </DropdownContextProvider>
        </div>
      </div>
    </div>
  );
};

const Dropdown = ({
  content,
  trigger,
  open,
  onOutsideClick,
  onMouseDown,
  header,
  footer,
  dropdownId,
  stretchTriggerHeight = false,
  stretchHeight = false,
  minWidth,
  maxWidth,
  hideBlockBorder = true,
  expandToViewport = false,
  preferCenter = false,
  interior = false,
  scrollable = true,
  loopFocus = expandToViewport,
  onFocus,
  onBlur,
  onFocusIn,
  onFocusOut,
  onEscape,
  contentKey,
  dropdownContentId,
  dropdownContentRole,
  ariaLabelledby,
  ariaDescribedby,
}: DropdownProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement | null>(null);
  const verticalContainerRef = useRef<HTMLDivElement>(null);
  // To keep track of the initial position (drop up/down) which is kept the same during fixed repositioning
  const fixedPosition = useRef<DropdownPosition | null>(null);

  const isRefresh = useVisualRefresh();

  const dropdownClasses = usePortalModeClasses(triggerRef);
  const [position, setPosition] = useState<DropdownContextProviderProps['position']>('bottom-right');

  const isMobile = useMobile();

  // Derive if dropdown should match trigger width exactly
  // This happens when both minWidth and maxWidth are explicitly set to 'trigger'
  const matchTriggerWidth = minWidth === 'trigger' && maxWidth === 'trigger';

  const setDropdownPosition = (
    position: DropdownPosition | InteriorDropdownPosition,
    triggerBox: LogicalDOMRect,
    target: HTMLDivElement,
    verticalContainer: HTMLDivElement
  ) => {
    verticalContainer.style.maxBlockSize = position.blockSize;

    // Only apply occupy-entire-width when matching trigger width exactly and not in portal mode
    if (!interior && matchTriggerWidth && !expandToViewport) {
      target.classList.add(styles['occupy-entire-width']);
    } else {
      target.style.inlineSize = position.inlineSize;
    }

    // Using styles for main dropdown to adjust its position as preferred alternative
    if (position.dropBlockStart && !interior) {
      target.classList.add(styles['dropdown-drop-up']);
      if (!expandToViewport) {
        target.style.insetBlockEnd = '100%';
      }
    } else {
      target.classList.remove(styles['dropdown-drop-up']);
    }
    target.classList.add(position.dropInlineStart ? styles['dropdown-drop-left'] : styles['dropdown-drop-right']);

    if (position.insetInlineStart && position.insetInlineStart !== 'auto') {
      target.style.insetInlineStart = position.insetInlineStart;
    }

    // Position normal overflow dropdowns with fixed positioning relative to viewport
    if (expandToViewport && !interior) {
      applyDropdownPositionRelativeToViewport({
        position,
        dropdownElement: target,
        triggerRect: triggerBox,
        isMobile,
      });
      // Keep track of the initial dropdown position and direction.
      // Dropdown direction doesn't need to change as the user scrolls, just needs to stay attached to the trigger.
      fixedPosition.current = position;
      return;
    }

    // For an interior dropdown (the fly out) we need exact values for positioning
    // and classes are not enough
    // usage of relative position is impossible due to overwrite of overflow-x
    if (interior && isInteriorPosition(position)) {
      if (position.dropBlockStart) {
        target.style.insetBlockEnd = position.insetBlockEnd;
      } else {
        target.style.insetBlockStart = position.insetBlockStart;
      }
      target.style.insetInlineStart = position.insetInlineStart;
    }

    if (position.dropBlockStart && position.dropInlineStart) {
      setPosition('top-left');
    } else if (position.dropBlockStart) {
      setPosition('top-right');
    } else if (position.dropInlineStart) {
      setPosition('bottom-left');
    } else {
      setPosition('bottom-right');
    }
  };

  const isOutsideDropdown = (element: Element) =>
    (!wrapperRef.current || !nodeBelongs(wrapperRef.current, element)) &&
    (!dropdownContainerRef.current || !nodeBelongs(dropdownContainerRef.current, element));

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

  const isOutsideDropdownContent = (element: Element) =>
    !dropdownRef.current || !nodeBelongs(dropdownRef.current, element);

  const focusInHandler = (event: React.FocusEvent) => {
    fireNonCancelableEvent(onFocusIn, event);
  };

  const focusOutHandler = (event: React.FocusEvent) => {
    if (!event.relatedTarget || isOutsideDropdownContent(event.relatedTarget)) {
      fireNonCancelableEvent(onFocusOut, event);
    }
  };

  // Check if the dropdown has enough space to fit with its desired width constraints
  // If not, remove the class that allows flexible width sizing
  const fixStretching = () => {
    const classNameToRemove = styles['use-flexible-width'];
    if (
      open &&
      dropdownRef.current &&
      triggerRef.current &&
      dropdownRef.current.classList.contains(classNameToRemove) &&
      !hasEnoughSpaceForFlexibleWidth({
        triggerElement: triggerRef.current,
        dropdownElement: dropdownRef.current,
        minWidthConstraint: minWidth,
        maxWidthConstraint: maxWidth,
        expandToViewport,
        stretchHeight,
        isMobile,
      })
    ) {
      dropdownRef.current.classList.remove(classNameToRemove);
    }
  };

  useResizeObserver(() => dropdownRef.current, fixStretching);

  useLayoutEffect(() => {
    const onDropdownOpen = () => {
      if (open && dropdownRef.current && triggerRef.current && verticalContainerRef.current) {
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
            matchTriggerWidth,
            stretchHeight,
            isMobile,
            minWidth,
            maxWidth
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
  }, [open, dropdownRef, triggerRef, verticalContainerRef, interior, matchTriggerWidth, isMobile, contentKey]);

  // subscribe to outside click
  useEffect(() => {
    if (!open) {
      return;
    }
    const clickListener = (event: MouseEvent) => {
      // Since the listener is registered on the window, `event.target` will incorrectly point at the
      // shadow root if the component is rendered inside shadow DOM.
      const target = event.composedPath ? event.composedPath()[0] : event.target;
      if (!nodeBelongs(dropdownRef.current, target) && !nodeBelongs(triggerRef.current, target)) {
        fireNonCancelableEvent(onOutsideClick);
      }
    };
    window.addEventListener('click', clickListener, true);

    return () => {
      window.removeEventListener('click', clickListener, true);
    };
  }, [open, onOutsideClick]);

  // subscribe to Escape key press
  useEffect(() => {
    if (!open) {
      return;
    }
    const keydownListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Prevent any surrounding modals or dialogs from acting on this Escape key
        event.stopPropagation();
        fireNonCancelableEvent(onEscape);
      }
    };
    window.addEventListener('keydown', keydownListener, true);

    return () => {
      window.removeEventListener('keydown', keydownListener, true);
    };
  }, [open, onEscape]);

  // sync dropdown position on scroll and resize
  useLayoutEffect(() => {
    if (!expandToViewport || !open) {
      return;
    }
    const updateDropdownPosition = () => {
      if (triggerRef.current && dropdownRef.current && verticalContainerRef.current && fixedPosition.current) {
        applyDropdownPositionRelativeToViewport({
          position: fixedPosition.current,
          dropdownElement: dropdownRef.current,
          triggerRect: getLogicalBoundingClientRect(triggerRef.current),
          isMobile,
        });
      }
    };

    updateDropdownPosition();

    const controller = new AbortController();
    window.addEventListener('scroll', updateDropdownPosition, { capture: true, signal: controller.signal });
    window.addEventListener('resize', updateDropdownPosition, { capture: true, signal: controller.signal });
    return () => {
      controller.abort();
    };
  }, [open, expandToViewport, isMobile]);

  const referrerId = useUniqueId();

  // Compute CSS variable values for min/max width
  // These will be used by the use-flexible-width CSS class
  const getMinWidthCssValue = (): string | undefined => {
    if (minWidth === undefined) {
      return undefined;
    }
    if (typeof minWidth === 'number') {
      return `${minWidth}px`;
    }
    // 'trigger' maps to 100% (relative to parent)
    return '100%';
  };

  const getMaxWidthCssValue = (): string | undefined => {
    if (maxWidth === undefined) {
      return 'none';
    }
    if (typeof maxWidth === 'number') {
      return `${maxWidth}px`;
    }
    // 'trigger' maps to 100% (relative to parent)
    return '100%';
  };

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
      <div id={referrerId} className={clsx(stretchTriggerHeight && styles['stretch-trigger-height'])} ref={triggerRef}>
        {trigger}
      </div>

      <TabTrap
        focusNextCallback={() => dropdownRef.current && getFirstFocusable(dropdownRef.current)?.focus()}
        disabled={!open || !loopFocus}
      />

      <DropdownContainer
        triggerRef={triggerRef}
        renderWithPortal={expandToViewport && !interior}
        id={dropdownId}
        referrerId={referrerId}
        open={open}
      >
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
                matchTriggerWidth={matchTriggerWidth}
                hideBlockBorder={hideBlockBorder}
                interior={interior}
                header={header}
                content={content}
                expandToViewport={expandToViewport}
                minWidth={getMinWidthCssValue()}
                maxWidth={getMaxWidthCssValue()}
                footer={footer}
                onMouseDown={onMouseDown}
                onFocusIn={focusInHandler}
                onFocusOut={focusOutHandler}
                isRefresh={isRefresh}
                dropdownRef={dropdownRef}
                verticalContainerRef={verticalContainerRef}
                position={position}
                id={dropdownContentId}
                role={dropdownContentRole}
                ariaLabelledby={ariaLabelledby}
                ariaDescribedby={ariaDescribedby}
              />

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
): position is InteriorDropdownPosition => (position as InteriorDropdownPosition).insetBlockEnd !== undefined;

export default Dropdown;
