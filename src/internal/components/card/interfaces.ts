// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../../base-component';

export interface BaseCardProps extends BaseComponentProps {
  /**
   * Heading text.
   */
  header?: React.ReactNode;

  /**
   * Supplementary text below the heading.
   */
  description?: React.ReactNode;

  /**
   * Specifies actions for the card.
   */
  actions?: React.ReactNode;

  /**
   * Primary content displayed in the card.
   */
  children?: React.ReactNode;

  /**
   * Icon which will be displayed at the top of the card,
   * aligned with the start of the content.
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
}

export interface InternalCardProps extends BaseCardProps {
  /**
   * Called when the user clicks on the card.
   */
  onClick?: React.MouseEventHandler<HTMLElement>;

  /**
   * Specifies whether the card is in active state.
   */
  selected?: boolean;

  metadataAttributes?: Record<string, string | undefined>;
}
