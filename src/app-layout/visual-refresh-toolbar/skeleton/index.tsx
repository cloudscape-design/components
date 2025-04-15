// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AppLayoutPropsWithDefaults } from '../../interfaces';
import {
  AppLayoutSkeletonBottomContentSlot,
  AppLayoutSkeletonSideSlot,
  AppLayoutSkeletonTopContentSlot,
  AppLayoutSkeletonTopSlot,
  useSkeletonSlotsAttributes,
} from '../internal';

export interface SkeletonLayoutProps
  extends Pick<
    AppLayoutPropsWithDefaults,
    | 'notifications'
    | 'headerVariant'
    | 'contentHeader'
    | 'content'
    | 'contentType'
    | 'maxContentWidth'
    | 'disableContentPaddings'
    | 'navigation'
    | 'navigationOpen'
    | 'navigationWidth'
    | 'tools'
    | 'toolsOpen'
    | 'toolsWidth'
    | 'placement'
  > {
  style?: React.CSSProperties;
  toolbar?: React.ReactNode;
  splitPanelOpen?: boolean;
  sideSplitPanel?: React.ReactNode;
  bottomSplitPanel?: React.ReactNode;
  globalTools?: React.ReactNode;
  globalToolsOpen?: boolean;
  navigationAnimationDisabled?: boolean;
  isNested?: boolean;
  rootRef?: React.Ref<HTMLDivElement>;
}

export const SkeletonLayout = (props: SkeletonLayoutProps) => {
  const { contentHeader, content } = props;
  const {
    wrapperElAttributes,
    mainElAttributes,
    contentWrapperElAttributes,
    contentHeaderElAttributes,
    contentElAttributes,
  } = useSkeletonSlotsAttributes(props) ?? {};

  return (
    <div {...wrapperElAttributes}>
      <AppLayoutSkeletonTopSlot {...props} />
      <main {...mainElAttributes}>
        <AppLayoutSkeletonTopContentSlot {...props} />
        <div {...contentWrapperElAttributes}>
          {contentHeader && <div {...contentHeaderElAttributes}>{contentHeader}</div>}
          <div {...contentElAttributes}>{content}</div>
        </div>
        <AppLayoutSkeletonBottomContentSlot {...props} />
      </main>
      <AppLayoutSkeletonSideSlot {...props} />
    </div>
  );
};
