// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useState, useRef } from 'react';

import { getLimitedValue } from '../../split-panel/utils/size-utils';
import { usePointerEvents } from '../../split-panel/utils/use-pointer-events';
import { useKeyboardEvents } from '../../split-panel/utils/use-keyboard-events';
import { Drawer } from './index';

import ResizeHandler from '../../split-panel/icons/resize-handler';
import splitPanelStyles from '../../split-panel/styles.css.js';
import { SizeControlProps, ResizableDrawerProps } from './interfaces';

export const ResizableDrawer = ({
  onResize,
  size,
  getMaxWidth,
  refs,
  activeDrawer,
  ...props
}: ResizableDrawerProps) => {
  const { isOpen, children, isMobile } = props;

  const MIN_WIDTH = activeDrawer?.size && activeDrawer.size < 280 ? activeDrawer?.size : 280;
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
    const id = activeDrawer.id;

    if (isOpen && maxWidth >= MIN_WIDTH) {
      onResize({ size, id });
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
    >
      <ResizeHandler className={clsx(splitPanelStyles['slider-icon'], splitPanelStyles[`slider-icon-side`])} />
    </div>
  );

  return (
    <Drawer
      {...props}
      ref={drawerRefObject}
      resizeHandle={
        !isMobile &&
        activeDrawer.resizable && <div className={splitPanelStyles['slider-wrapper-side']}>{resizeHandle}</div>
      }
    >
      {children}
    </Drawer>
  );
};
