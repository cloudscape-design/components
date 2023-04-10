// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useState, useRef } from 'react';
import { AppLayoutButton, CloseButton, togglesConfig } from '../toggles';

import { getLimitedValue } from '../../split-panel/utils/size-utils';
import { usePointerEvents } from '../../split-panel/utils/use-pointer-events';
import { useKeyboardEvents } from '../../split-panel/utils/use-keyboard-events';
import useFocusVisible from '../../internal/hooks/focus-visible';

import ResizeHandler from '../../split-panel/icons/resize-handler';
import testutilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';
import splitPanelStyles from '../../split-panel/styles.css.js';
import { DesktopDrawerProps, DrawerTriggersBar, DrawerItem, SizeControlProps } from './interfaces';

// We are using two landmarks per drawer, i.e. two NAVs and two ASIDEs, because of several
// known bugs in NVDA that cause focus changes within a container to sometimes not be
// announced. As a result, we use one region for the open button and one region for the
// actual drawer content, always hiding the other one when it's not visible.
// An alternative solution to follow a more classic implementation here to only have one
// button that triggers the opening/closing of the drawer also did not work due to another
// series of bugs in NVDA (together with Firefox) which prevent the changed expanded state
// from being announced.
// Even with this workaround in place, the announcement of the close button when opening a
// panel in NVDA is not working correctly. The suspected root cause is one of the bugs below
// as well.
// Relevant tickets:
// * https://github.com/nvaccess/nvda/issues/6606
// * https://github.com/nvaccess/nvda/issues/5825
// * https://github.com/nvaccess/nvda/issues/5247
// * https://github.com/nvaccess/nvda/pull/8869 (reverted PR that was going to fix it)
export function Drawer({
  contentClassName,
  toggleClassName,
  closeClassName,
  width,
  type,
  toggleRefs,
  topOffset,
  bottomOffset,
  ariaLabels,
  children,
  isOpen,
  isMobile,
  onToggle,
  onClick,
  onLoseFocus,
  drawers,
  onResize,
  size,
  getMaxWidth,
  refs,
}: DesktopDrawerProps) {
  const openButtonWrapperRef = useRef<HTMLElement | null>(null);
  const { TagName, iconName, getLabels } = togglesConfig[type];
  const { mainLabel, closeLabel, openLabel } = getLabels(ariaLabels);
  const drawerContentWidthOpen = isMobile ? undefined : width;
  const drawerContentWidth = isOpen ? drawerContentWidthOpen : undefined;

  const activeDrawer = drawers?.items.find(item => item.id === drawers.activeDrawerId);

  const MIN_WIDTH = activeDrawer?.size && activeDrawer.size < 280 ? activeDrawer?.size : 280;
  const [relativeSize, setRelativeSize] = useState(0);
  const focusVisible = useFocusVisible();

  useEffect(() => {
    // effects are called inside out in the components tree
    // wait one frame to allow app-layout to complete its calculations
    const handle = requestAnimationFrame(() => {
      const maxSize = getMaxWidth();
      setRelativeSize((size / maxSize) * 100);
    });
    return () => cancelAnimationFrame(handle);
  }, [size, getMaxWidth]);

  const setSidePanelWidth = (width: number) => {
    const maxWidth = getMaxWidth();
    const size = getLimitedValue(MIN_WIDTH, width, maxWidth);

    if (isOpen && maxWidth >= MIN_WIDTH) {
      onResize({ size });
    }
  };

  const position = 'side';
  const setBottomPanelHeight = () => {};
  const drawerRefObject = useRef<HTMLDivElement>(null);

  const sizeControlProps: SizeControlProps = {
    position,
    splitPanelRef: drawerRefObject,
    handleRef: refs.slider,
    setSidePanelWidth,
    setBottomPanelHeight,
  };

  const onSliderPointerDown = usePointerEvents(sizeControlProps);
  const onKeyDown = useKeyboardEvents(sizeControlProps);

  const resizeHandle = (
    <div
      ref={refs.slider}
      role="slider"
      tabIndex={0}
      aria-label="resize handler"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={relativeSize}
      className={clsx(splitPanelStyles.slider, splitPanelStyles[`slider-side`])}
      onKeyDown={onKeyDown}
      onPointerDown={onSliderPointerDown}
      {...focusVisible}
    >
      <ResizeHandler className={clsx(splitPanelStyles['slider-icon'], splitPanelStyles[`slider-icon-side`])} />
    </div>
  );

  const regularOpenButton = (
    <TagName ref={openButtonWrapperRef} aria-label={mainLabel} className={styles.toggle} aria-hidden={isOpen}>
      <AppLayoutButton
        ref={toggleRefs.toggle}
        className={toggleClassName}
        iconName={iconName}
        ariaLabel={openLabel}
        onClick={() => onToggle(true)}
        ariaExpanded={false}
      />
    </TagName>
  );

  return (
    <div
      ref={drawerRefObject}
      className={clsx(styles.drawer, {
        [styles['drawer-closed']]: !isOpen,
        [testutilStyles['drawer-closed']]: !isOpen,
        [styles['drawer-mobile']]: isMobile,
      })}
      style={{ width: drawerContentWidth }}
      onBlur={
        onLoseFocus
          ? e => {
              if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
                onLoseFocus(e);
              }
            }
          : undefined
      }
      onClick={event => {
        if (onClick) {
          onClick(event);
        }
        if (!isOpen) {
          // to prevent calling onToggle from the drawer when it's called from the toggle button
          if (
            openButtonWrapperRef.current === event.target ||
            !openButtonWrapperRef.current?.contains(event.target as Node)
          ) {
            onToggle(true);
          }
        }
      }}
    >
      <div
        style={{ width: drawerContentWidth, top: topOffset, bottom: bottomOffset }}
        className={clsx(styles['drawer-content'], contentClassName)}
      >
        {!isMobile && regularOpenButton}
        {activeDrawer?.resizable && !isMobile && (
          <div className={splitPanelStyles['slider-wrapper-side']}>{resizeHandle}</div>
        )}
        <TagName aria-label={activeDrawer?.ariaLabels.content || mainLabel} aria-hidden={!isOpen}>
          <CloseButton
            ref={toggleRefs.close}
            className={closeClassName}
            ariaLabel={activeDrawer?.ariaLabels.closeButton || closeLabel}
            onClick={() => {
              onToggle(false);
              drawers?.onChange({ activeDrawerId: undefined });
            }}
          />
          {children}
        </TagName>
      </div>
    </div>
  );
}
export function DrawerTriggersBar({ isMobile, topOffset, bottomOffset, drawers, contentClassName }: DrawerTriggersBar) {
  return (
    <div
      className={clsx(styles.drawer, styles['drawer-closed'], testutilStyles['drawer-closed'], {
        [styles['drawer-mobile']]: isMobile,
      })}
    >
      <div
        style={{ top: topOffset, bottom: bottomOffset }}
        className={clsx(styles['drawer-content'], styles['non-interactive'], contentClassName)}
      >
        {!isMobile && (
          <aside aria-label="Drawers" className={styles['drawer-triggers']}>
            {drawers?.items?.map((item: DrawerItem, index: number) => (
              <AppLayoutButton
                className={clsx(
                  styles.trigger,
                  styles['trigger-drawer'],
                  drawers.activeDrawerId === item.id && styles.selected
                )}
                key={`drawer-trigger-${index}`}
                iconName={item.trigger.iconName}
                iconSvg={item.trigger.iconSvg}
                ariaLabel={item.ariaLabels?.triggerButton}
                onClick={() => drawers.onChange({ activeDrawerId: item.id })}
                ariaExpanded={drawers.activeDrawerId !== undefined}
              />
            ))}
          </aside>
        )}
      </div>
    </div>
  );
}
