// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TooltipProps } from './interfaces';

/**
 * Internal tooltip props - includes props not exposed in public API.
 * Note: position defaults to 'top' in both index.tsx and internal.tsx
 */
export interface InternalTooltipProps extends TooltipProps {
  /**
   * Additional CSS class for the tooltip container.
   */
  className?: string;
}
