// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';
import { PopoverProps } from '../popover/interfaces';

export interface TokenProps extends BaseComponentProps {
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
  popoverProps?: TokenProps.TokenPopoverProps;
  onDismiss?: NonCancelableEventHandler;

  /** @awsuiSystem core */
  children?: React.ReactNode;

  /** @awsuiSystem core */
  customActionProps?: TokenProps.CustomActionProps;
}

export namespace TokenProps {
  export type Variant = 'normal' | 'inline';
  export type TokenPopoverProps = Omit<PopoverProps, 'triggerType' | 'wrapTriggerText' | 'children'>;

  export interface CustomActionProps {
    ariaLabel?: string;
    disabled?: boolean;
    onClick?: NonCancelableEventHandler;
    iconAlt?: string;
    iconName?: IconProps.Name;
    iconUrl?: string;
    iconSvg?: React.ReactNode;
    popoverProps?: TokenPopoverProps;
  }
}
