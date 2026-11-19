// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { BreadcrumbGroupProps } from './interfaces';

export type InternalBreadcrumbGroupProps<T extends BreadcrumbGroupProps.Item = BreadcrumbGroupProps.Item> =
  BreadcrumbGroupProps<T> &
    InternalBaseComponentProps & {
      __injectAnalyticsComponentMetadata?: boolean;
    };
