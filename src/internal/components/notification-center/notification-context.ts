// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { NotificationCenterProps, ToastProps } from './interface';

export interface NotificationProviderContext {
  toast: (message: NotificationCenterProps.ToastMessage) => NotificationCenterProps.ID;
  viewAll: () => void;
  markViewed: (key: NotificationCenterProps.ID) => void;
  messages: Array<ToastProps>;
}

export default React.createContext<NotificationProviderContext>({
  toast: () => null,
  viewAll: () => {},
  markViewed: () => {},
  messages: [],
});
