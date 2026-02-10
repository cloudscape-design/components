// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { GeneratedAnalyticsMetadataAppLayoutToolbarComponent } from '../../../app-layout-toolbar/analytics-metadata/interfaces';
import { BuiltInErrorBoundary } from '../../../error-boundary/internal';
import RemoteI18nProvider from '../../../i18n/providers/remote-provider';
import VisualContext from '../../../internal/components/visual-context';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { AppLayoutInternalProps, AppLayoutPendingState } from '../interfaces';
import {
  AppLayoutAfterMainSlot,
  AppLayoutBeforeMainSlot,
  AppLayoutBottomContentSlot,
  AppLayoutTopContentSlot,
  loadFormatter,
} from '../internal';
import { isWidgetReady } from '../state/invariants';
import { ToolbarProps } from '../toolbar';
import { SkeletonPartProps, SkeletonSlotsAttributes } from './interfaces';

import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

export interface SkeletonLayoutProps {
  registered: boolean;
  appLayoutProps: AppLayoutInternalProps;
  appLayoutState: AppLayoutPendingState;
  toolbarProps: ToolbarProps | null;
  skeletonSlotsAttributes: SkeletonSlotsAttributes;
}

const componentAnalyticsMetadata: GeneratedAnalyticsMetadataAppLayoutToolbarComponent = {
  name: 'awsui.AppLayoutToolbar',
  label: {
    selector: 'h1',
    root: 'body',
  },
};

export const SkeletonLayout = ({
  registered,
  appLayoutProps,
  appLayoutState,
  toolbarProps,
  skeletonSlotsAttributes,
}: SkeletonLayoutProps) => {
  const { contentHeader, content, navigationWidth } = appLayoutProps;
  const mergedProps: SkeletonPartProps = {
    toolbarProps,
    appLayoutProps,
    appLayoutState,
  };
  const {
    wrapperElAttributes,
    mainElAttributes,
    contentWrapperElAttributes,
    contentHeaderElAttributes,
    contentElAttributes,
  } = skeletonSlotsAttributes;

  const isWidgetLoaded = isWidgetReady(appLayoutState);

  return (
    <VisualContext contextName="app-layout-toolbar">
      <RemoteI18nProvider loadFormatter={loadFormatter}>
        <div
          {...getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })}
          ref={appLayoutState.rootRef as React.Ref<HTMLDivElement>}
          data-awsui-app-layout-widget-loaded={isWidgetLoaded}
          {...wrapperElAttributes}
          className={wrapperElAttributes?.className ?? clsx(styles.root, testutilStyles.root)}
          style={
            wrapperElAttributes?.style ?? {
              blockSize: `calc(100vh - ${appLayoutProps.placement.insetBlockStart + appLayoutProps.placement.insetBlockEnd}px)`,
              [customCssProps.navigationWidth]: `${navigationWidth}px`,
            }
          }
        >
          <AppLayoutBeforeMainSlot {...mergedProps} />
          <main {...mainElAttributes} className={mainElAttributes?.className ?? styles['main-landmark']}>
            <AppLayoutTopContentSlot {...mergedProps} />
            <div
              {...contentWrapperElAttributes}
              className={
                contentWrapperElAttributes?.className ??
                clsx(styles.main, { [styles['main-disable-paddings']]: appLayoutProps.disableContentPaddings })
              }
            >
              {contentHeader && <div {...contentHeaderElAttributes}>{contentHeader}</div>}
              {/* delay rendering the content until registration of this instance is complete */}
              <div {...contentElAttributes} className={contentElAttributes?.className ?? testutilStyles.content}>
                {registered ? <BuiltInErrorBoundary>{content}</BuiltInErrorBoundary> : null}
              </div>
            </div>
            <AppLayoutBottomContentSlot {...mergedProps} />
          </main>
          <AppLayoutAfterMainSlot {...mergedProps} />
        </div>
      </RemoteI18nProvider>
    </VisualContext>
  );
};
