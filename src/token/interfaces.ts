// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TokenProps extends BaseComponentProps {
  children: React.ReactNode;
  ariaLabel?: string;
  dismissLabel?: string;
  onDismiss?: NonCancelableEventHandler;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  variant?: TokenProps.Variant;
}

export namespace TokenProps {
  export type Variant = 'normal' | 'inline';
}
