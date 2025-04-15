// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { createWidgetizedComponent } from '../../../../internal/widgets';
import { SkeletonLayoutProps } from '../index';

import sharedStyles from '../../../resize/styles.css.js';
import styles from '../styles.css.js';

const SidePageSlot = (props: SkeletonLayoutProps) => {
  const { sideSplitPanel, splitPanelOpen, toolsOpen, navigationOpen, tools, globalToolsOpen, globalTools } = props;
  return (
    <>
      {sideSplitPanel && (
        <div className={clsx(styles['split-panel-side'], !splitPanelOpen && styles['panel-hidden'])}>
          {sideSplitPanel}
        </div>
      )}
      <div
        className={clsx(
          styles.tools,
          !toolsOpen && styles['panel-hidden'],
          sharedStyles['with-motion-horizontal'],
          navigationOpen && !toolsOpen && styles['unfocusable-mobile'],
          toolsOpen && styles['tools-open']
        )}
      >
        {tools}
      </div>
      <div className={clsx(styles['global-tools'], !globalToolsOpen && styles['panel-hidden'])}>{globalTools}</div>
    </>
  );
};

export const createWidgetizedAppLayoutSidePageSlot = createWidgetizedComponent(SidePageSlot);
