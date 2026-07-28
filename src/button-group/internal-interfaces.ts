// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
import { ButtonGroupProps } from './interfaces';

export interface InternalIconButton extends ButtonGroupProps.IconButton {
  analyticsAction?: string;
}
export interface InternalIconToggleButton extends ButtonGroupProps.IconToggleButton {
  analyticsAction?: string;
}

export type InternalItemOrGroup = InternalItem | ButtonGroupProps.Group;
export type InternalItem =
  | InternalIconButton
  | InternalIconToggleButton
  | ButtonGroupProps.IconFileInput
  | ButtonGroupProps.MenuDropdown
  | ButtonGroupProps.IconCopyToClipboard;

export interface InternalButtonGroupProps
  extends SomeRequired<ButtonGroupProps, 'dropdownExpandToViewport'>,
    InternalBaseComponentProps {
  style?: ButtonGroupProps.Style;
  items: ReadonlyArray<InternalItemOrGroup>;
}
