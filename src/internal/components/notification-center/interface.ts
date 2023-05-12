// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReactNode } from 'react';
import { ButtonProps } from '../../../button/interfaces';

export namespace NotificationCenterProps {
  export interface ToastMessage {
    type: NotificationCenterProps.Type;
    duration: number;
    title: string;
    content: ReactNode;
    position?: NotificationCenterProps.Position;

    ariaRole?: NotificationCenterProps.AriaRole;
    dismissible?: boolean;
    dismissLabel?: string;
    statusIconAriaLabel?: string;
    onDismiss?: ButtonProps['onClick'];
  }

  export type Type = 'success' | 'warning' | 'info' | 'error';
  export type AriaRole = 'alert' | 'status';
  export type Position = 'top' | 'bottom';
  export type ID = string | null;
}

export interface ToastProps {
  message: NotificationCenterProps.ToastMessage;
  id: NotificationCenterProps.ID;
  visible: boolean; //popped up
  reviewed: boolean;
  createdAt: number;
}
