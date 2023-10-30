// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';
import { IconProps } from '../icon/interfaces';

export interface AppLayoutProps extends BaseComponentProps {
  /**
   * Determines the default behavior of the component based on some predefined page layouts.
   * Individual properties will always take precedence over the default coming from the content type.
   */
  contentType?: AppLayoutProps.ContentType;

  /**
   * If `true`, disables outer paddings for the content slot.
   */
  disableContentPaddings?: boolean;

  /**
   * Activates a backwards-compatibility mode for applications with non-fixed headers and footers.
   * @deprecated This layout is being phased out and may miss some features.
   */
  disableBodyScroll?: boolean;

  /**
   * State of the navigation drawer.
   */
  navigationOpen?: boolean;

  /**
   * Navigation drawer width in pixels.
   */
  navigationWidth?: number;

  /**
   * If `true`, the navigation drawer is not displayed at all.
   */
  navigationHide?: boolean;

  /**
   * State of the tools drawer.
   */
  toolsOpen?: boolean;

  /**
   * If `true`, the tools drawer is not displayed at all.
   */
  toolsHide?: boolean;

  /**
   * Tools drawer width in pixels.
   */
  toolsWidth?: number;

  /**
   * Maximum main content panel width in pixels.
   *
   * If set to `Number.MAX_VALUE`, the main content panel will occupy the full available width.
   */
  maxContentWidth?: number;

  /**
   * Minimum main content panel width in pixels.
   */
  minContentWidth?: number;

  /**
   * If true, the notification slot is rendered above the scrollable
   * content area so it is always visible.
   *
   * Note that sticky notifications are not supported in Internet Explorer.
   */
  stickyNotifications?: boolean;

  /**
   * CSS selector for the application header.
   */
  headerSelector?: string;

  /**
   * CSS selector for the application footer.
   */
  footerSelector?: string;

  /**
   * Aria labels for the drawer operating buttons. Use this property to ensure accessibility.
   *
   * * `navigation` (string) - Label for the landmark that wraps the navigation drawer.
   * * `navigationClose` (string) - Label for the button that closes the navigation drawer.
   * * `navigationToggle` (string) - Label for the button that opens the navigation drawer.
   * * `notification` (string) - Label for the region that contains notification messages.
   * * `tools` (string) - Label for the landmark that wraps the tools drawer.
   * * `toolsClose` (string) - Label for the button that closes the tools drawer.
   * * `toolsToggle` (string) - Label for the button that opens the tools drawer.
   *
   * Example:
   * ```
   * {
   *   navigation: "Navigation drawer",
   *   navigationClose: "Close navigation drawer",
   *   navigationToggle: "Open navigation drawer",
   *   notifications: "Notifications",
   *   tools: "Help panel",
   *   toolsClose: "Close help panel",
   *   toolsToggle: "Open help panel"
   * }
   * ```
   * @i18n
   */
  ariaLabels?: AppLayoutProps.Labels;

  /**
   * Navigation drawer.
   */
  navigation?: React.ReactNode;

  /**
   * Top area of the page content.
   * @deprecated Replaced by the `header` slot of the [content layout](/components/content-layout/) component.
   * @visualrefresh
   */
  contentHeader?: React.ReactNode;

  /**
   * Disables overlap between `contentHeader` and `content` slots.
   * @deprecated Replaced by the `disableOverlap` property of the [content layout](/components/content-layout/) component.
   * @visualrefresh
   */
  disableContentHeaderOverlap?: boolean;

  /**
   * Main content.
   */
  content?: React.ReactNode;

  /**
   * Tools drawer.
   */
  tools?: React.ReactNode;

  /**
   * Displayed on top of the main content in the scrollable area.
   *
   * Conceived to contain notifications (flash messages).
   */
  notifications?: React.ReactNode;

  /**
   * Use this slot to add the [breadcrumb group component](/components/breadcrumb-group/) to the app layout.
   */
  breadcrumbs?: React.ReactNode;

  /**
   * Fired when the navigation drawer is toggled.
   */
  onNavigationChange?: NonCancelableEventHandler<AppLayoutProps.ChangeDetail>;

  /**
   * Fired when the tools drawer is toggled.
   */
  onToolsChange?: NonCancelableEventHandler<AppLayoutProps.ChangeDetail>;

  /**
   * Use this slot to add the [split panel component](/components/split-panel/) to the app layout.
   *
   * Note: If provided, this property should be set to `null` or `undefined` if a split panel should not be rendered.
   */
  splitPanel?: React.ReactNode;

  /**
   * The size of the split panel in pixels.
   */
  splitPanelSize?: number;

  /**
   * State of the split panel.
   */
  splitPanelOpen?: boolean;
  /**
   * Controls the split panel preferences.
   *
   * By default, the preference is `{ position: 'bottom' }`
   */
  splitPanelPreferences?: AppLayoutProps.SplitPanelPreferences;
  /**
   * Fired when the split panel is resized.
   */
  onSplitPanelResize?: NonCancelableEventHandler<AppLayoutProps.SplitPanelResizeDetail>;
  /**
   * Fired when the split panel is toggled.
   */
  onSplitPanelToggle?: NonCancelableEventHandler<AppLayoutProps.ChangeDetail>;
  /**
   * Fired when the split panel preferences change.
   */
  onSplitPanelPreferencesChange?: NonCancelableEventHandler<AppLayoutProps.SplitPanelPreferences>;
}

export namespace AppLayoutProps {
  export type ContentType = 'default' | 'form' | 'table' | 'cards' | 'wizard' | 'dashboard';

  export interface Ref {
    /**
     * Manually closes the navigation drawer if it is necessary for the current
     * viewport size.
     */
    closeNavigationIfNecessary(): void;

    /**
     * Opens the tools panel if it is not already open. Note that it is preferable
     * to control the state by listening to `toolsChange` and providing `toolsOpen`.
     */
    openTools(): void;

    /**
     * Focuses the tools panel if it is open. Use this to focus the tools panel
     * after changing the content, for example when clicking on an 'info' link while
     * the panel is already open.
     */
    focusToolsClose(): void;

    /**
     * Focuses the active drawer. Use this to focus the active drawer after opening it programmatically.
     */
    focusActiveDrawerClose(): void;

    /**
     * Focuses the split panel if it is open.
     */
    focusSplitPanel(): void;
  }

  export interface Labels {
    notifications?: string;

    navigation?: string;
    navigationToggle?: string;
    navigationClose?: string;

    tools?: string;
    toolsToggle?: string;
    toolsClose?: string;
  }

  export interface ChangeDetail {
    open: boolean;
  }

  export interface SplitPanelResizeDetail {
    size: number;
  }

  export interface SplitPanelPreferences {
    position: 'side' | 'bottom';
  }
  // Duplicated the positions because using this definition in SplitPanelPreferences would display
  // 'AppLayoutProps.SplitPanelPosition' on the API docs instead of the string values.
  export type SplitPanelPosition = 'side' | 'bottom';
}

export interface PublicDrawer {
  id: string;
  content: React.ReactNode;
  trigger: {
    iconName?: IconProps.Name;
    iconSvg?: React.ReactNode;
  };
  ariaLabels: PublicDrawerAriaLabels;
  badge?: boolean;
  resizable?: boolean;
  defaultSize?: number;
  onResize?: NonCancelableEventHandler<{ size: number }>;
}

export interface PublicAriaLabelsWithDrawers extends AppLayoutProps.Labels {
  drawers?: string;
  drawersOverflow?: string;
  drawersOverflowWithBadge?: string;
}

export interface PublicDrawerAriaLabels {
  drawerName: string;
  closeButton?: string;
  triggerButton?: string;
  resizeHandle?: string;
}
