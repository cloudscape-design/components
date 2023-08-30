// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useState, useRef } from 'react';

import { getLimitedValue } from '../../split-panel/utils/size-utils';
import { usePointerEvents } from '../utils/use-pointer-events';
import { useKeyboardEvents } from '../utils/use-keyboard-events';
import { SizeControlProps } from '../utils/interfaces';
import { Drawer as InternalDrawer } from './index';
import testutilStyles from '../test-classes/styles.css.js';

import ResizeHandler from '../../split-panel/icons/resize-handler';
import splitPanelStyles from '../../split-panel/styles.css.js';
import { ResizableDrawerProps } from './interfaces';
import Drawer from '../../internal/components/drawer';

export const ResizableDrawer = ({
  onResize,
  size,
  getMaxWidth,
  refs,
  activeDrawer,
  ...props
}: ResizableDrawerProps) => {
  const { isOpen, children, isMobile } = props;

  const MIN_WIDTH = activeDrawer?.defaultSize && activeDrawer.defaultSize < 280 ? activeDrawer?.defaultSize : 280;
  const [relativeSize, setRelativeSize] = useState(0);

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
    const id = activeDrawer?.id;

    if (isOpen && id && maxWidth >= MIN_WIDTH) {
      onResize({ size, id });
    }
  };

  const position = 'side';
  const setBottomPanelHeight = () => {};
  const drawerRefObject = useRef<HTMLDivElement>(null);

  const sizeControlProps: SizeControlProps = {
    position,
    panelRef: drawerRefObject,
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

  return (
    <InternalDrawer
      {...props}
      ref={drawerRefObject}
      resizeHandle={
        !isMobile &&
        activeDrawer?.resizable && <div className={splitPanelStyles['slider-wrapper-side']}>{resizeHandle}</div>
      }
      drawersAriaLabels={{
        openLabel: activeDrawer?.ariaLabels?.triggerButton,
        mainLabel: activeDrawer?.ariaLabels?.content,
        closeLabel: activeDrawer?.ariaLabels?.closeButton,
      }}
    >
      {children}
      <Drawer>hello!</Drawer>
    </InternalDrawer>
  );
};
