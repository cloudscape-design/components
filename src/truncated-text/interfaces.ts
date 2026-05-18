// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface TruncatedTextProps extends BaseComponentProps {
  /**
   * The inline text to display. If there isn't enough space to render the text
   * in a single line, it is truncated with an ellipsis and the full content is
   * shown on pointer hover or keyboard focus.
   */
  children?: React.ReactNode;

  /**
   * The content of the tooltip shown when the text is truncated. By default, the
   * tooltip content is the same as the `children` slot. Use only if the `children`
   * slot may contain interactive elements.
   */
  tooltipText?: string;
}
