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

export interface SkeletonLayoutProps {
  appLayoutProps: AppLayoutInternalProps;
  appLayoutState: ReturnType<typeof useAppLayout>;
}

import { useSkeletonSlotsAttributes } from './widget-slots';

export const SkeletonLayout = (props: SkeletonLayoutProps) => {
  const { appLayoutProps, appLayoutState } = props;
  const { registered } = appLayoutState;
  const { contentHeader, content } = appLayoutProps;
  const {
    wrapperElAttributes,
    mainElAttributes,
    contentWrapperElAttributes,
    contentHeaderElAttributes,
    contentElAttributes,
  } = useSkeletonSlotsAttributes(props) ?? {};

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
