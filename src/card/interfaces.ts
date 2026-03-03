// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
/**
 * @awsuiSystem core
 */
import { NativeAttributes } from '../internal/utils/with-native-attributes';

export interface BaseCardProps extends BaseComponentProps {
  /**
   * Heading element of the card. Use this to add a title or header text.
   */
  header?: React.ReactNode;

  /**
   * A description or subtitle displayed below the header.
   */
  description?: React.ReactNode;

  /**
   * Footer content displayed at the bottom of the card.
   */
  footer?: React.ReactNode;

  /**
   * Actions to display in the card header area, typically buttons or links.
   */
  actions?: React.ReactNode;

  /**
   * Main content of the card.
   */
  children?: React.ReactNode;

  /**
   * Icon displayed in the card header.
   */
  icon?: React.ReactNode;

  /**
   * Removes the default padding from the header area.
   * @default false
   */
  disableHeaderPaddings?: boolean;

  /**
   * Removes the default padding from the content area.
   * @default false
   */
  disableContentPaddings?: boolean;

  /**
   * Removes the default padding from the footer area.
   * @default false
   */
  disableFooterPaddings?: boolean;
}

export interface CardProps extends BaseCardProps {
  /**
   * Attributes to add to the native root element.
   * Some attributes will be automatically combined with internal attribute values:
   * - `className` will be appended.
   * - Event handlers will be chained, unless the default is prevented.
   *
   * We do not support using this attribute to apply custom styling.
   *
   * @awsuiSystem core
   */
  nativeAttributes?: NativeAttributes<React.HTMLAttributes<HTMLDivElement>>;
}

export interface InternalCardProps extends BaseCardProps, Pick<CardProps, 'nativeAttributes'> {
  /**
   * Called when the user clicks on the card.
   */
  onClick?: React.MouseEventHandler<HTMLElement>;

  /**
   * Specifies whether the card is in highlighted state.
   */
  highlighted?: boolean;

  metadataAttributes?: Record<string, string | undefined>;
}
