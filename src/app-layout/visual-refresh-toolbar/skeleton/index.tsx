// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import VisualContext from '../../../internal/components/visual-context';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { AppLayoutInternalProps } from '../interfaces';
import {
  AppLayoutSkeletonBottomContentSlot,
  AppLayoutSkeletonSideSlot,
  AppLayoutSkeletonTopContentSlot,
  AppLayoutSkeletonTopSlot,
} from '../internal';
import { useAppLayout } from '../use-app-layout';
import { useSkeletonSlotsAttributes } from './widget-slots/use-skeleton-slots-attributes';

import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

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
  const { contentHeader, content, navigationWidth } = appLayoutProps;
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
      <div
        {...wrapperElAttributes}
        className={wrapperElAttributes?.className ?? clsx(styles.root, testutilStyles.root)}
        style={
          wrapperElAttributes?.style ?? {
            [customCssProps.navigationWidth]: `${navigationWidth}px`,
          }
        }
      >
        <AppLayoutSkeletonTopSlot {...props} />
        <main {...mainElAttributes} className={mainElAttributes?.className ?? styles['main-landmark']}>
          {!isAppLayoutStateLoading && <AppLayoutSkeletonTopContentSlot {...props} />}
          <div
            {...contentWrapperElAttributes}
            className={
              contentWrapperElAttributes?.className ??
              clsx(styles.main, { [styles['main-disable-paddings']]: appLayoutProps.disableContentPaddings })
            }
          >
            {contentHeader && <div {...contentHeaderElAttributes}>{contentHeader}</div>}
            {/*delay rendering the content until registration of this instance is complete*/}
            <div {...contentElAttributes} className={contentElAttributes?.className ?? testutilStyles.content}>
              {isAppLayoutStateLoading || registered ? content : null}
            </div>
          </div>
          {!isAppLayoutStateLoading && <AppLayoutSkeletonBottomContentSlot {...props} />}
        </main>
        {!isAppLayoutStateLoading && <AppLayoutSkeletonSideSlot {...props} />}
      </div>
    </VisualContext>
  );
};
