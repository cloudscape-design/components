// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AppLayoutInternalProps } from '../interfaces';
import {
  AppLayoutSkeletonBottomContentSlot,
  AppLayoutSkeletonSideSlot,
  AppLayoutSkeletonTopContentSlot,
  AppLayoutSkeletonTopSlot,
  useSkeletonSlotsAttributes,
} from '../internal';
import { useAppLayout } from '../use-app-layout';

export interface SkeletonLayoutProps {
  appLayoutProps: AppLayoutInternalProps;
  appLayoutState: ReturnType<typeof useAppLayout>;
}

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

  return (
    <div {...wrapperElAttributes}>
      <AppLayoutSkeletonTopSlot {...props} />
      <main {...mainElAttributes}>
        <AppLayoutSkeletonTopContentSlot {...props} />
        <div {...contentWrapperElAttributes}>
          {contentHeader && <div {...contentHeaderElAttributes}>{contentHeader}</div>}
          {/*delay rendering the content until registration of this instance is complete*/}
          <div {...contentElAttributes}>{registered ? content : null}</div>
        </div>
        <AppLayoutSkeletonBottomContentSlot {...props} />
      </main>
      <AppLayoutSkeletonSideSlot {...props} />
    </div>
  );
};
