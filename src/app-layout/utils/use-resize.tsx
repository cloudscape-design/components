// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { fireNonCancelableEvent } from '../../internal/events';
import clsx from 'clsx';

import ResizeHandler from '../../split-panel/icons/resize-handler';
import { getLimitedValue } from '../../split-panel/utils/size-utils';
import { usePointerEvents } from './use-pointer-events';
import { useKeyboardEvents } from './use-keyboard-events';
import { DrawerItemProps, DrawersProps } from '../visual-refresh/drawers';

import splitPanelStyles from '../../split-panel/styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';
import styles from '../visual-refresh/styles.css.js';
import { DrawerFocusControlRefs } from './use-drawer-focus-control';
import { SizeControlProps } from './interfaces';

export interface DrawerResizeProps {
  activeDrawerId?: string | null;
  drawers?: DrawersProps;
  drawersRefs: DrawerFocusControlRefs;
  isToolsOpen: boolean;
  drawersMaxWidth: number;
}

function useResize(drawerRefObject: React.RefObject<HTMLDivElement>, drawerResizeProps: DrawerResizeProps) {
  const { activeDrawerId, drawers, drawersRefs, isToolsOpen, drawersMaxWidth } = drawerResizeProps;

  const activeDrawer = drawers?.items.find((item: DrawerItemProps) => item.id === activeDrawerId) ?? null;
  const drawerItems = useMemo(() => drawers?.items || [], [drawers?.items]);
  const toolsWidth = 290;
  const MIN_WIDTH = activeDrawer?.defaultSize && activeDrawer.defaultSize < 290 ? activeDrawer?.defaultSize : 290;
  const [relativeSize, setRelativeSize] = useState(0);
  const getDrawerItemSizes = useCallback(() => {
    const sizes: { [id: string]: number } = {};
    if (!drawerItems) {
      return {};
    }

    for (const item of drawerItems) {
      if (item.defaultSize) {
        sizes[item.id] = item.defaultSize;
      }
    }
    return sizes;
  }, [drawerItems]);
  const [drawerItemSizes, setDrawerItemSizes] = useState(() => getDrawerItemSizes());

  const drawerSize =
    !activeDrawerId && !isToolsOpen
      ? 0
      : activeDrawerId && drawerItemSizes[activeDrawerId]
      ? drawerItemSizes[activeDrawerId]
      : toolsWidth;

  useEffect(() => {
    // Ensure we only set new drawer items by performing a shallow merge
    // of the latest drawer item sizes, and previous drawer item sizes.
    setDrawerItemSizes(prev => ({ ...getDrawerItemSizes(), ...prev }));
  }, [getDrawerItemSizes]);

  useEffect(() => {
    // effects are called inside out in the components tree
    // wait one frame to allow app-layout to complete its calculations
    const handle = requestAnimationFrame(() => {
      const maxSize = drawersMaxWidth;
      setRelativeSize(((drawerSize - MIN_WIDTH) / (maxSize - MIN_WIDTH)) * 100);
    });
    return () => cancelAnimationFrame(handle);
  }, [drawerSize, drawersMaxWidth, MIN_WIDTH]);

  const drawerResize = (resizeDetail: { size: number; id: string }) => {
    const drawerItem = drawers?.items.find((item: DrawerItemProps) => item.id === resizeDetail.id);
    fireNonCancelableEvent(drawerItem?.onResize, resizeDetail);
    setDrawerItemSizes({ ...drawerItemSizes, [resizeDetail.id]: resizeDetail.size });
  };

  const setSidePanelWidth = (width: number) => {
    const maxWidth = drawersMaxWidth;
    const size = getLimitedValue(MIN_WIDTH, width, maxWidth);
    const id = activeDrawer?.id;

    if (id && maxWidth >= MIN_WIDTH) {
      drawerResize({ size, id });
    }
  };

  const sizeControlProps: SizeControlProps = {
    position: 'side',
    panelRef: drawerRefObject,
    handleRef: drawersRefs.slider,
    setSidePanelWidth,
    setBottomPanelHeight: () => {},
    hasTransitions: true,
  };

  const onSliderPointerDown = usePointerEvents(sizeControlProps);
  const onKeyDown = useKeyboardEvents(sizeControlProps);

  const resizeHandle = (
    <div
      ref={drawersRefs.slider}
      role="slider"
      tabIndex={0}
      aria-label={activeDrawer?.ariaLabels?.resizeHandle}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={relativeSize}
      className={clsx(splitPanelStyles.slider, splitPanelStyles[`slider-side`], testutilStyles['drawers-slider'])}
      onKeyDown={onKeyDown}
      onPointerDown={onSliderPointerDown}
    >
      <ResizeHandler className={clsx(splitPanelStyles['slider-icon'], splitPanelStyles[`slider-icon-side`])} />
    </div>
  );

  return { resizeHandle: <div className={styles['drawer-slider']}>{resizeHandle}</div>, drawerSize };
}

export default useResize;
