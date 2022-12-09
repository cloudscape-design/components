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
   * @visualrefresh `stacked` variant
   */
  variant?: 'default' | 'stacked';
}
