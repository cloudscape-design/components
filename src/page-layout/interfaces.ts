// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AppLayoutProps } from '../app-layout/interfaces';

export interface PageLayoutProps extends AppLayoutProps {
  /**
   * If `true`, the navigation trigger is not displayed at all,
   * while navigation drawer might be displayed, but opened using a custom trigger.
   */
  navigationTriggerHide?: boolean;

  /**
   * Drawers property. If you set both `drawers` and `tools`, `drawers` will take precedence.

   * Each Drawer is an item in the drawers wrapper with the following properties:
   * * id (string) - the id of the drawer.
   * * content (React.ReactNode) - the content in the drawer.
   * * trigger (DrawerTrigger) - (Optional) the button that opens and closes the active drawer.
   * If not set, a corresponding trigger button is not displayed, while the drawer might be displayed, but opened using a custom trigger.
   * * ariaLabels (DrawerAriaLabels) - the labels for the interactive elements of the drawer.
   * * badge (boolean) - Adds a badge to the corner of the icon to indicate a state change. For example: Unread notifications.
   * * resizable (boolean) - if the drawer is resizable or not.
   * * defaultSize (number) - starting size of the drawer. if not set, defaults to 290.
   * * onResize (({ size: number }) => void) - Fired when the active drawer is resized.
   *
   * #### DrawerTrigger
   * - `iconName` (IconProps.Name) - (Optional) Specifies the icon to be displayed.
   * - `iconSvg` (React.ReactNode) - (Optional) Specifies the SVG of a custom icon. For more information, see [SVG icon guidelines](/components/icon/?tabId=api#slots)
   *
   * #### DrawerAriaLabels
   * - `drawerName` (string) - Label for the drawer itself, and for the drawer trigger button tooltip text.
   * - `closeButton` (string) - (Optional) Label for the close button.
   * - `triggerButton` (string) - (Optional) Label for the trigger button.
   * - `resizeHandle` (string) - (Optional) Label for the resize handle.
   */
  drawers?: Array<PageLayoutProps.Drawer>;
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
