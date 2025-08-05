// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TokenProps extends BaseComponentProps {
  /** @awsUiSystem core */
  children?: React.ReactNode;

  onDismiss?: NonCancelableEventHandler;

  label?: string;
  ariaLabel?: string;
  labelTag?: string;
  description?: string;
  variant?: TokenProps.Variant;
  disabled?: boolean;
  readOnly?: boolean;
  iconAlt?: string;
  iconName?: IconProps.Name;
  iconUrl?: string;
  iconSvg?: React.ReactNode;
  tags?: ReadonlyArray<string>;
  dismissLabel?: string;
}

export namespace TokenProps {
  export type Variant = 'normal' | 'inline';
}
