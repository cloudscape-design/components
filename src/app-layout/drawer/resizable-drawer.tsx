// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import PanelResizeHandle from '../../internal/components/panel-resize-handle';
import { getLimitedValue } from '../../split-panel/utils/size-utils.js';
import { SizeControlProps } from '../utils/interfaces.js';
import { TOOLS_DRAWER_ID } from '../utils/use-drawers.js';
import { useKeyboardEvents } from '../utils/use-keyboard-events.js';
import { usePointerEvents } from '../utils/use-pointer-events.js';
import { Drawer } from './index.js';
import { ResizableDrawerProps } from './interfaces.js';

import testutilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';

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
  const { onKeyDown, onDirectionClick } = useKeyboardEvents(sizeControlProps);

  return (
    <Drawer
      {...props}
      id={activeDrawer?.id}
      width={clampedWidth}
      ref={drawerRefObject}
      isHidden={!activeDrawer}
      resizeHandle={
        !isMobile &&
        activeDrawer?.resizable && (
          <PanelResizeHandle
            ref={refs.slider}
            position="side"
            className={testutilStyles['drawers-slider']}
            ariaLabel={activeDrawer?.ariaLabels?.resizeHandle}
            tooltipText={activeDrawer?.ariaLabels?.resizeHandleTooltipText}
            ariaValuenow={relativeSize}
            onKeyDown={onKeyDown}
            onDirectionClick={onDirectionClick}
            onPointerDown={onSliderPointerDown}
          />
        )
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
