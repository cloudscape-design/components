// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import React from 'react';

export interface ContainerProps extends BaseComponentProps {
  /**
   * Heading element of the container. Use the [header component](/components/header/).
   */
  header?: React.ReactNode;

  /**
   * Determines whether the container header has padding. If `true`, removes the default padding from the header.
   */
  disableHeaderPaddings?: boolean;

  /**
   *
   * Use this slot to render a media element. Supported element types are 'img', 'video', and 'picture'.
   * You can define different positions and sizes for the media element within the container.
   *
   * * `content` - Use this slot to render your media element. We support `img`, `video`, `picture`, and `iframe` elements.
   *
   * * `position` - Defines the media slot's position within the container. Defaults to `top`.
   *
   * * `width` - Defines the width of the media slot when positioned on the side. Corresponds to the `width` CSS-property.
   * When this value is set, media elements larger than the defined width may be cropped, with 'object-fit: cover' centering it.
   * Note: This value is considered only when `position` is set to `side`.
   * If no width is provided, the media slot will take a maximum of 66% of the container's width.
   *
   * * `height` - Defines the height of the media slot when position on the top. Corresponds to the `height` CSS-property.
   * When this value is set, media elements larger than the defined width may be cropped, with 'object-fit: cover' centering it.   * Note: This value is only considered if `position` is set to `top`.
   * If no height is provided, the media slot will be displayed at its full height.
   *
   */
  media?: ContainerProps.Media;

  /**
   * Main content of the container.
   */
  children?: React.ReactNode;

  /**
   * Determines whether the container content has padding. If `true`, removes the default padding from the content area.
   */
  disableContentPaddings?: boolean;

  /**
   * Enabling this property will make the container to fit into available height. If content is too short, the container
   * will stretch, if too long, the container will shrink and show vertical scrollbar.
   *
   * Use this property to align heights of multiple containers displayed in a single row. It is recommended to stretch
   * all containers to the height of the longest one, to avoid extra vertical scroll areas.
   */
  fitHeight?: boolean;

  /**
   * Footer of the container.
   */
  footer?: React.ReactNode;

  /**
   * Specify a container variant with one of the following:
   * * `default` - Use this variant in standalone context.
   * * `stacked` - Use this variant adjacent to other stacked containers (such as a container,
   *               table).
   * * `page`    - Use this variant for page-level headers in content-rich interfaces.
   * @visualrefresh `stacked` variant
   */
  variant?: 'default' | 'stacked' | 'page';
}

export namespace ContainerProps {
  export interface Media {
    /**
     * Use this slot to render your media element. We support `img`, `video`, `picture`, and `iframe` elements.
     */
    content: React.ReactNode;

    /**
     * Defines the media slot's position within the container. Defaults to `top`.
     */
    position?: 'top' | 'side';

    /**
     * Defines the width of the media slot when positioned on the side. Corresponds to the `width` CSS-property.
     * When this value is set, the media element may be cropped, with `object-fit: cover` centering it.
     *
     * Note: This value is considered only when `position` is set to `side`.
     * If no width is provided, the media slot will take a maximum of 66% of the container's width.
     */
    width?: string | number;

    /**
     * Defines the height of the media slot when position on the top. Corresponds to the `height` CSS-property.
     * When this value is set, the media element may be cropped, with `object-fit: cover` centering it.
     *
     * Note: This value is only considered if `position` is set to `top`.
     * If no height is provided, the media slot will be displayed at its full height.
     */
    height?: string | number;
  }
}
