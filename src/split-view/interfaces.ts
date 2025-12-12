// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReactNode } from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface SplitViewProps extends BaseComponentProps {
  /**
   * Position of the panel with respect to the main content
   */
  panelPosition?: SplitViewProps.PanelPosition;

  /**
   * Initial panel size, for uncontrolled behavior.
   *
   * The actual size may vary, depending on `minPanelSize` and `maxPanelSize`.
   */
  defaultPanelSize?: number;

  /**
   * Size of the panel. If provided, and panel is resizable, the component is controlled,
   * so you must also provide `onPanelResize`.
   *
   * The actual size may vary, depending on `minPanelSize` and `maxPanelSize`.
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
   * Determines how the panel is styled:
   * - 'panel': Styled as a solid panel with border dividing it from main content.
   * - 'custom': No styling applied: add your own.
   */
  panelVariant?: SplitViewProps.PanelVariant;

  /**
   * Panel contents.
   */
  panelContent: ReactNode;

  /**
   * Main content area displayed next to the panel.
   */
  mainContent: ReactNode;

  /**
   * Determines which content is displayed:
   * - 'all': Both panel and main content are displayed.
   * - 'panel-only': Only panel is displayed.
   * - 'main-only': Only main content is displayed.
   */
  display?: SplitViewProps.Display;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: SplitViewProps.I18nStrings;

  /**
   * Called when the user resizes the panel.
   */
  onPanelResize?: NonCancelableEventHandler<SplitViewProps.PanelResizeDetail>;
}

export namespace SplitViewProps {
  export type PanelPosition = 'side-start' | 'side-end';
  export type PanelVariant = 'panel' | 'custom';
  export type Display = 'all' | 'panel-only' | 'main-only';

  export interface PanelResizeDetail {
    totalSize: number;
    panelSize: number;
  }

  export interface I18nStrings {
    resizeHandleAriaLabel?: string;
    resizeHandleTooltipText?: string;
  }

  export interface Ref {
    /**
     * Focuses the resize handle of the split view.
     */
    focusResizeHandle(): void;
  }
}
