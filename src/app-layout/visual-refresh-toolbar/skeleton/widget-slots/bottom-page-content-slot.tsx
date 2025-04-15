// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { createWidgetizedComponent } from '../../../../internal/widgets';
import { SkeletonLayoutProps } from '../index';

import styles from '../styles.css.js';

const BottomPageContentSlot = (props: SkeletonLayoutProps) => {
  const { bottomSplitPanel, placement } = props;
  return (
    <>
      {bottomSplitPanel && (
        <div className={styles['split-panel-bottom']} style={{ insetBlockEnd: placement.insetBlockEnd }}>
          {bottomSplitPanel}
        </div>
      )}
    </>
  );
};

export const createWidgetizedAppLayoutBottomPageContentSlot = createWidgetizedComponent(BottomPageContentSlot);
