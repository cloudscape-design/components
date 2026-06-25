// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CSSProperties } from 'react';

import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { AnalyticsMetadata } from '../types/analytics';
import { FormFieldProps } from './interfaces';

export interface InternalFormFieldProps extends FormFieldProps, InternalBaseComponentProps {
  /**
   * Visually hide the label.
   */
  __hideLabel?: boolean;

  /**
   * Disable the gutter applied by default.
   */
  __disableGutters?: boolean;
  __analyticsMetadata?: AnalyticsMetadata;
  __style?: CSSProperties;
}
