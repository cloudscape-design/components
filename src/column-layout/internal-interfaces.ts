// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { ColumnLayoutProps } from './interfaces';
import { ColumnLayoutBreakpoint } from './internal';

export interface InternalColumnLayoutProps extends ColumnLayoutProps, InternalBaseComponentProps {
  __breakpoint?: ColumnLayoutBreakpoint;
  /**
   * Overrides the default wrapper HTML tag.
   */
  __tagOverride?: 'dl';
}
