// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

export interface ContentLayoutProps extends BaseComponentProps {
  /**
   * Use this slot to render the main content of the layout below the header.
   * @displayname content
   */
  children?: React.ReactNode;

  /**
   * Determines whether the layout has an overlap between the header and content.
   * If true, the overlap will be removed.
   * @visualrefresh
   */
  disableOverlap?: boolean;

  /**
   * Use this slot to render the header content for the layout.
   */
  header?: React.ReactNode;

  /**
   * Specifies the color mode (light or dark mode) for the header area.
   * By default, it follows the color mode of the page.
   * Set this to "dark" to achieve a dark header.
   */
  headerMode?: ContentLayoutProps.ColorMode;

  /**
   * Specifies the `max-width` CSS value for the header and content slots.
   * When a maximum width is defined, the header and content are horizontally centered.
   */
  maxWidth?: string;

  /**
   * Specifies the `background` CSS property shorthand for a full-size background image.
   * For more details on the syntax, refer to the [background MDN documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/background).
   */
  headerBackgroundCss?: string;
}

export namespace ContentLayoutProps {
  export type ColorMode = 'default' | 'dark';
}
