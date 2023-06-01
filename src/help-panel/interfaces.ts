// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import React from 'react';

export interface HelpPanelProps extends BaseComponentProps {
  /**
   * Header of the help panel.
   *
   * It should contain the only `h2` used in the help panel.
   */
  header?: React.ReactNode;

  /**
   * Main content of the help panel.
   *
   * Use `p, a, h3, h4, h5, span, div, ul, ol, li, code, pre, dl, dt, dd, hr, br, i, em, b, strong` tags to format the content.
   * Use `code` for inline code or `pre` for code blocks.
   */
  children?: React.ReactNode;

  /**
   * Footer of the help panel.
   */
  footer?: React.ReactNode;

  /**
   * Renders the panel in a loading state. We recommend that you also set a `loadingText`.
   */
  loading?: boolean;

  /**
   * Specifies the text that's displayed when the panel is in a loading state.
   * @i18n
   */
  loadingText?: string;
}
