// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

export interface ContentLayoutProps extends BaseComponentProps {
  children?: React.ReactNode;
  disableOverlap?: boolean;
  header?: React.ReactNode;
}
