// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReactNode } from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface PanelLayoutProps extends BaseComponentProps {
  /**
   * Position of the panel with respect to the main content
   */
  panelPosition?: PanelLayoutProps.PanelPosition;

  /**
   * Initial panel size, for uncontrolled behavior.
   *
   * The actual size will be constrained by `minPanelSize` and `maxPanelSize`, if set.
   */
  defaultPanelSize?: number;

  /**
   * Size of the panel. If provided, and panel is resizable, the component is controlled,
   * so you must also provide `onPanelResize`.
   *
   * The actual size will be constrained by `minPanelSize` and `maxPanelSize`, if set.
   */
  panelSize?: number;

  /**
   * The minimum size of the panel.
   */
  minPanelSize?: number;

  /**
   * The maximum size of the panel.
   */
  maxPanelSize?: number;

  /**
   * Indicates whether the panel is resizable.
   */
  resizable?: boolean;

  /**
   * Panel contents.
   */
  panelContent: ReactNode;

  /**
   * Main content area displayed next to the panel.
   */
  mainContent: ReactNode;

  /**
   * Makes the panel content focusable. This should be used if there are no focusable elements
   * inside the panel, to ensure it is keyboard scrollable.
   *
   * Provide either `{ariaLabel: "Panel label"}` or `{ariaLabelledby: "panel-label-id"}`
   */
  panelFocusable?: PanelLayoutProps.FocusableConfig;

  /**
   * Makes the main content area focusable. This should be used if there are no focusable elements
   * inside the content, to ensure it is keyboard scrollable.
   *
   * Provide either `{ariaLabel: "Main label"}` or `{ariaLabelledby: "main-label-id"}`
   */
  mainFocusable?: PanelLayoutProps.FocusableConfig;

  /**
   * Determines which content is displayed:
   * - 'all': Both panel and main content are displayed.
   * - 'panel-only': Only panel is displayed.
   * - 'main-only': Only main content is displayed.
   */
  display?: PanelLayoutProps.Display;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: PanelLayoutProps.I18nStrings;

  /**
   * Called when the user resizes the panel.
   */
  onPanelResize?: NonCancelableEventHandler<PanelLayoutProps.PanelResizeDetail>;

  /**
   * Called when the panel and/or main content size changes. This can be due
   * to user resizing or changes to the available space on the page.
   */
  onLayoutChange?: NonCancelableEventHandler<PanelLayoutProps.PanelResizeDetail>;
}

export namespace PanelLayoutProps {
  export type PanelPosition = 'side-start' | 'side-end';
  export type Display = 'all' | 'panel-only' | 'main-only';

  export interface PanelResizeDetail {
    totalSize: number;
    panelSize: number;
  }

  export interface FocusableConfig {
    ariaLabel?: string;
    ariaLabelledby?: string;
  }

  export interface I18nStrings {
    resizeHandleAriaLabel?: string;
    resizeHandleTooltipText?: string;
  }

  export interface Ref {
    /**
     * Focuses the resize handle of the panel layout.
     */
    focusResizeHandle(): void;
  }
}
