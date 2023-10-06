// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';

import { getLimitedValue } from '../../split-panel/utils/size-utils';
import { usePointerEvents } from '../utils/use-pointer-events';
import { useKeyboardEvents } from '../utils/use-keyboard-events';
import { SizeControlProps } from '../utils/interfaces';
import { Drawer } from './index';
import testutilStyles from '../test-classes/styles.css.js';

import ResizeHandler from '../../split-panel/icons/resize-handler';
import splitPanelStyles from '../../split-panel/styles.css.js';
import styles from './styles.css.js';
import { ResizableDrawerProps } from './interfaces';
import { TOOLS_DRAWER_ID } from '../utils/use-drawers';

export const ResizableDrawer = ({
  onResize,
  maxWidth,
  minWidth,
  refs,
  activeDrawer,
  toolsContent,
  ...props
}: ResizableDrawerProps) => {
  const { isOpen, children, width, isMobile } = props;

  const clampedWidth = getLimitedValue(minWidth, width, maxWidth);
  const relativeSize = ((clampedWidth - minWidth) / (maxWidth - minWidth)) * 100;

  const setSidePanelWidth = (newWidth: number) => {
    const size = getLimitedValue(minWidth, newWidth, maxWidth);
    const id = activeDrawer?.id;

    if (isOpen && id && maxWidth >= minWidth) {
      onResize({ size, id });
    }
  };

  const drawerRefObject = useRef<HTMLDivElement>(null);

  const sizeControlProps: SizeControlProps = {
    position: 'side',
    panelRef: drawerRefObject,
    handleRef: refs.slider,
    onResize: setSidePanelWidth,
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
    <Drawer
      {...props}
      id={activeDrawer?.id}
      width={clampedWidth}
      ref={drawerRefObject}
      isHidden={!activeDrawer}
      resizeHandle={
        !isMobile &&
        activeDrawer?.resizable && <div className={splitPanelStyles['slider-wrapper-side']}>{resizeHandle}</div>
      }
      ariaLabels={{
        openLabel: activeDrawer?.ariaLabels?.triggerButton,
        mainLabel: activeDrawer?.ariaLabels?.drawerName,
        closeLabel: activeDrawer?.ariaLabels?.closeButton,
      }}
    >
      {toolsContent && <div className={clsx(activeDrawer?.id !== TOOLS_DRAWER_ID && styles.hide)}>{toolsContent}</div>}
      {activeDrawer?.id !== TOOLS_DRAWER_ID ? children : null}
    </Drawer>
  );
};
