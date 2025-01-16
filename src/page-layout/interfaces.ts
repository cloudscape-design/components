// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AppLayoutProps } from '../app-layout/interfaces';

export interface PageLayoutProps extends AppLayoutProps {
  /**
   * If `true`, the navigation trigger is not displayed at all,
   * while navigation drawer might be displayed, but opened using a custom trigger.
   */
  navigationTriggerHide?: boolean;
}

export namespace PageLayoutProps {
  export type AnalyticsMetadata = AppLayoutProps.AnalyticsMetadata;
  export type ContentType = AppLayoutProps.ContentType;
  export type Ref = AppLayoutProps.Ref;
  export type Drawer = AppLayoutProps.Drawer;
  export type DrawerAriaLabels = AppLayoutProps.DrawerAriaLabels;
  export type Labels = AppLayoutProps.Labels;
  export type ChangeDetail = AppLayoutProps.ChangeDetail;
  export type SplitPanelResizeDetail = AppLayoutProps.SplitPanelResizeDetail;
  export type SplitPanelPreferences = AppLayoutProps.SplitPanelPreferences;
  export type SplitPanelPosition = AppLayoutProps.SplitPanelPosition;
  export type DrawerChangeDetail = AppLayoutProps.DrawerChangeDetail;
}
