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

import PanelResizeHandle from '../../internal/components/panel-resize-handle';
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
            ariaValuenow={relativeSize}
            onKeyDown={onKeyDown}
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
