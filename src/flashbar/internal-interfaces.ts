// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { FlashbarProps } from './interfaces';

// Style API v2
export interface FlashbarStyleClassNames {
  item?: string | ((props: { item: FlashbarProps.MessageDefinition }) => string);
  icon?: string;
  dismissButton?: string;
  notificationBar?: string;
}

export type InternalFlashbarProps = FlashbarProps &
  InternalBaseComponentProps & { styleClassNames?: FlashbarStyleClassNames };
