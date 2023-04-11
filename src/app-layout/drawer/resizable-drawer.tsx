// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useState, useRef } from 'react';

import { getLimitedValue } from '../../split-panel/utils/size-utils';
import { usePointerEvents } from '../../split-panel/utils/use-pointer-events';
import { useKeyboardEvents } from '../../split-panel/utils/use-keyboard-events';
import useFocusVisible from '../../internal/hooks/focus-visible';
import { Drawer } from './index';

import ResizeHandler from '../../split-panel/icons/resize-handler';
import splitPanelStyles from '../../split-panel/styles.css.js';
import { SizeControlProps, ResizableDrawerProps } from './interfaces';

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
      {...focusVisible}
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
