// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { Slot } from '../internal/utils/style-slot';
import { FlashbarProps } from './interfaces';

// Style API v2
export interface FlashbarStyleClassNames {
  item?: Slot<{ item: FlashbarProps.MessageDefinition }>;
  icon?: string;
  dismissButton?: string;
  notificationBar?: string;
}

export type InternalFlashbarProps = FlashbarProps &
  InternalBaseComponentProps & { styleClassNames?: FlashbarStyleClassNames };
