// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext } from 'react';
import NotificationContext, { NotificationProviderContext } from './notification-context';
import { NotificationProvider } from './notification-provider';

export const useNotificationContext = (): NotificationProviderContext => useContext(NotificationContext);
export default NotificationProvider;
