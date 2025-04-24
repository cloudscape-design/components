// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import VisualContext from '../../../internal/components/visual-context';
import { AppLayoutInternalProps } from '../interfaces';
import {
  AppLayoutSkeletonBottomContentSlot,
  AppLayoutSkeletonSideSlot,
  AppLayoutSkeletonTopContentSlot,
  AppLayoutSkeletonTopSlot,
} from '../internal';
import { useAppLayout } from '../use-app-layout';
import { useSkeletonSlotsAttributes } from './widget-slots/use-skeleton-slots-attributes';

export interface SkeletonLayoutProps {
  appLayoutProps: AppLayoutInternalProps;
  appLayoutState: ReturnType<typeof useAppLayout>;
}

export interface RootSkeletonLayoutProps extends SkeletonLayoutProps {
  skeletonSlotsAttributes: ReturnType<typeof useSkeletonSlotsAttributes>;
}

export const SkeletonLayout = (props: RootSkeletonLayoutProps) => {
  const { appLayoutProps, appLayoutState, skeletonSlotsAttributes } = props;
  const { registered } = appLayoutState;
  const { contentHeader, content } = appLayoutProps;
  const {
    wrapperElAttributes,
    mainElAttributes,
    contentWrapperElAttributes,
    contentHeaderElAttributes,
    contentElAttributes,
  } = skeletonSlotsAttributes;

  const isAppLayoutStateLoading = Object.keys(appLayoutState).length === 0;

  return (
    <VisualContext contextName="app-layout-toolbar">
      <div {...wrapperElAttributes}>
        {!isAppLayoutStateLoading && <AppLayoutSkeletonTopSlot {...props} />}
        <main {...mainElAttributes}>
          {!isAppLayoutStateLoading && <AppLayoutSkeletonTopContentSlot {...props} />}
          <div {...contentWrapperElAttributes}>
            {contentHeader && <div {...contentHeaderElAttributes}>{contentHeader}</div>}
            {/*delay rendering the content until registration of this instance is complete*/}
            <div {...contentElAttributes}>{isAppLayoutStateLoading || registered ? content : null}</div>
          </div>
          {!isAppLayoutStateLoading && <AppLayoutSkeletonBottomContentSlot {...props} />}
        </main>
        {!isAppLayoutStateLoading && <AppLayoutSkeletonSideSlot {...props} />}
      </div>
    </VisualContext>
  );
};
