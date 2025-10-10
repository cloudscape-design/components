// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useResize } from '~components/app-layout/visual-refresh-toolbar/drawer/use-resize';
import PanelResizeHandle from '~components/internal/components/panel-resize-handle';
import { getLimitedValue } from '~components/split-panel/utils/size-utils';

import styles from './styles.scss';

interface PanelProps {
  defaultWidth?: number;
  minWidth: number;
  maxWidth: number;
  onResize?: (value: number) => void;
}

const Panel: React.FC<PanelProps> = ({ children, maxWidth, minWidth, onResize, defaultWidth = 300 }) => {
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [panelSize, setPanelSize] = useState(defaultWidth);
  const resizeProps = useResize({
    currentWidth: panelSize,
    minWidth,
    maxWidth,
    panelRef: panelRef,
    handleRef: sliderRef,
    position: 'side-start',
    onResize: size => {
      onResize?.(size);
      setPanelSize(size);
    },
  });
  const size = getLimitedValue(minWidth, panelSize, maxWidth);

  return (
    <div className={styles.panel} ref={panelRef} style={{ inlineSize: `${size}px` }}>
      <div>{children}</div>
      <div className={styles['panels-slider']}>
        <PanelResizeHandle
          ref={sliderRef}
          position="side-start"
          ariaLabel="Resize handle"
          tooltipText="Resize handle"
          ariaValuenow={resizeProps.relativeSize}
          onKeyDown={resizeProps.onKeyDown}
          onDirectionClick={resizeProps.onDirectionClick}
          onPointerDown={resizeProps.onPointerDown}
        />
      </div>
    </div>
  );
};

export default function ResizablePanelsPage() {
  return (
    <>
      <div className={styles['panels-container']}>
        <Panel minWidth={360} defaultWidth={350} maxWidth={window.innerWidth - 360}>
          <div>panel 1</div>
        </Panel>
        <div style={{ minInlineSize: '360px' }}>panel 2</div>
      </div>
    </>
  );
}
