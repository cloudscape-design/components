// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../../base-component';

export interface InternalCardProps extends BaseComponentProps {
  /**
   * Specifies an action for the card.
   * It is recommended to use a button with inline-icon variant.
   */
  actions?: React.ReactNode;

  /**
   * Specifies whether the card is in active state.
   */
  selected?: boolean;

  /**
   * Primary content displayed in the card.
   */
  children?: React.ReactNode;

  /**
   * Heading text.
   */
  header?: React.ReactNode;

  /**
   * Supplementary text below the heading.
   */
  description?: React.ReactNode;

  /**
   * Icon which will be displayed at the top of the card,
   * inline at the start of the content.
   */
  icon?: React.ReactNode;

  /**
   * Determines whether the card header has padding. If `true`, removes the default padding from the header.
   */
  disableHeaderPaddings?: boolean;

  /**
   * Determines whether the card content has padding. If `true`, removes the default padding from the content area.
   */
  disableContentPaddings?: boolean;

  /**
   * Called when the user clicks on the card.
   */
  onClick?: React.MouseEventHandler<HTMLElement>;

  metadataAttributes?: Record<string, string | undefined>;
}
