// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useEffect } from 'react';

import clsx from 'clsx';

import ResizeHandler from '../../split-panel/icons/resize-handler';
import { getLimitedValue } from '../../split-panel/utils/size-utils';
import { usePointerEvents } from './use-pointer-events';
import { useKeyboardEvents } from './use-keyboard-events';
import { AppLayoutProps } from '../interfaces';

import splitPanelStyles from '../../split-panel/styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';
import styles from '../visual-refresh/styles.css.js';
import { FocusControlRefs } from './use-focus-control';
import { SizeControlProps } from './interfaces';

export interface DrawerResizeProps {
  activeDrawer: AppLayoutProps.Drawer | undefined;
  activeDrawerSize: number;
  onActiveDrawerResize: (detail: { id: string; size: number }) => void;
  drawersRefs: FocusControlRefs;
  isToolsOpen: boolean;
  drawersMaxWidth: number;
}

function useResize(
  drawerRefObject: React.RefObject<HTMLDivElement>,
  { activeDrawer, activeDrawerSize, onActiveDrawerResize, drawersRefs, isToolsOpen, drawersMaxWidth }: DrawerResizeProps
) {
  const toolsWidth = 290;
  const MIN_WIDTH = Math.min(activeDrawer?.defaultSize ?? Number.POSITIVE_INFINITY, toolsWidth);
  const [relativeSize, setRelativeSize] = useState(0);

  const drawerSize = !activeDrawer && !isToolsOpen ? 0 : activeDrawerSize;

  useEffect(() => {
    // effects are called inside out in the components tree
    // wait one frame to allow app-layout to complete its calculations
    const handle = requestAnimationFrame(() => {
      const maxSize = drawersMaxWidth;
      setRelativeSize(((drawerSize - MIN_WIDTH) / (maxSize - MIN_WIDTH)) * 100);
    });
    return () => cancelAnimationFrame(handle);
  }, [drawerSize, drawersMaxWidth, MIN_WIDTH]);

  const setSidePanelWidth = (width: number) => {
    const maxWidth = drawersMaxWidth;
    const size = getLimitedValue(MIN_WIDTH, width, maxWidth);
    const id = activeDrawer?.id;

    if (id && maxWidth >= MIN_WIDTH) {
      onActiveDrawerResize({ size, id });
    }
  };

  const sizeControlProps: SizeControlProps = {
    position: 'side',
    panelRef: drawerRefObject,
    handleRef: drawersRefs.slider,
    onResize: setSidePanelWidth,
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
