// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import PanelResizeHandle from '../../internal/components/panel-resize-handle/index.js';
import { getLimitedValue } from '../../split-panel/utils/size-utils.js';
import { AppLayoutProps } from '../interfaces.js';
import { SizeControlProps } from './interfaces.js';
import { FocusControlRefs } from './use-focus-control.js';
import { useKeyboardEvents } from './use-keyboard-events.js';
import { usePointerEvents } from './use-pointer-events.js';

import testutilStyles from '../test-classes/styles.css.js';

interface DrawerResizeProps {
  activeDrawer: AppLayoutProps.Drawer | undefined;
  activeDrawerSize: number;
  onActiveDrawerResize: (detail: { id: string; size: number }) => void;
  drawersRefs: FocusControlRefs;
  isToolsOpen: boolean;
  drawersMaxWidth: number;
  drawersMinWidth: number;
}

function useResize(
  drawerRefObject: React.RefObject<HTMLDivElement>,
  {
    activeDrawer,
    activeDrawerSize,
    onActiveDrawerResize,
    drawersRefs,
    isToolsOpen,
    drawersMinWidth,
    drawersMaxWidth,
  }: DrawerResizeProps
) {
  const [relativeSize, setRelativeSize] = useState(0);

  const drawerSize = !activeDrawer && !isToolsOpen ? 0 : activeDrawerSize;

  useEffect(() => {
    // effects are called inside out in the components tree
    // wait one frame to allow app-layout to complete its calculations
    const handle = requestAnimationFrame(() => {
      const maxSize = drawersMaxWidth;
      setRelativeSize(((drawerSize - drawersMinWidth) / (maxSize - drawersMinWidth)) * 100);
    });
    return () => cancelAnimationFrame(handle);
  }, [drawerSize, drawersMaxWidth, drawersMinWidth]);

  const setSidePanelWidth = (width: number) => {
    const maxWidth = drawersMaxWidth;
    const size = getLimitedValue(drawersMinWidth, width, maxWidth);
    const id = activeDrawer?.id;

    if (id && maxWidth >= drawersMinWidth) {
      onActiveDrawerResize({ size, id });
    }
  };

  const sizeControlProps: SizeControlProps = {
    position: 'side',
    panelRef: drawerRefObject,
    handleRef: drawersRefs.slider,
    onResize: setSidePanelWidth,
  };

  const onSliderPointerDown = usePointerEvents(sizeControlProps);
  const { onKeyDown, onDirectionClick } = useKeyboardEvents(sizeControlProps);

  const resizeHandle = (
    <PanelResizeHandle
      ref={drawersRefs.slider}
      position="side"
      ariaLabel={activeDrawer?.ariaLabels?.resizeHandle}
      tooltipText={activeDrawer?.ariaLabels?.resizeHandleTooltipText}
      ariaValuenow={relativeSize}
      className={testutilStyles['drawers-slider']}
      onKeyDown={onKeyDown}
      onDirectionClick={onDirectionClick}
      onPointerDown={onSliderPointerDown}
    />
  );

  return { resizeHandle, drawerSize };
}

export default useResize;
