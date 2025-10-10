// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useResize } from '~components/app-layout/visual-refresh-toolbar/drawer/use-resize';
import PanelResizeHandle from '~components/internal/components/panel-resize-handle';

import styles from './styles.scss';

export default function ResizablePanelsPage() {
  const panel1SliderRef = React.createRef<HTMLDivElement>();
  const panel1Ref = React.createRef<HTMLDivElement>();
  const [panel1Size, setPanel1Size] = useState(200);
  const resizeProps = useResize({
    currentWidth: panel1Size,
    minWidth: 200,
    maxWidth: 700,
    panelRef: panel1Ref,
    handleRef: panel1SliderRef,
    position: 'side-start',
    onResize: size => {
      console.log(size);
      setPanel1Size(size);
    },
  });
  return (
    <div className={styles['panels-container']}>
      <div className={styles.panel} ref={panel1Ref} style={{ width: `${panel1Size}px` }}>
        panel 1
        <PanelResizeHandle
          ref={panel1SliderRef}
          position="side"
          className={styles['panels-slider']}
          ariaLabel="Resize handle"
          tooltipText="Resize handle"
          ariaValuenow={resizeProps.relativeSize}
          onKeyDown={resizeProps.onKeyDown}
          onDirectionClick={resizeProps.onDirectionClick}
          onPointerDown={resizeProps.onPointerDown}
        />
      </div>
      <div>panel 2</div>
    </div>
  );
}
