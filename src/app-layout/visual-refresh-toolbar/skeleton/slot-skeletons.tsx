// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AppLayoutNotificationsImplementationProps } from '../notifications/index.js';
import { AppLayoutToolbarImplementationProps } from '../toolbar/index.js';
import { BreadcrumbsSlot } from './breadcrumbs/index.js';
import { NotificationsSlot, ToolbarSlot } from './slot-wrappers.js';

export const ToolbarSkeleton = React.forwardRef<HTMLElement, AppLayoutToolbarImplementationProps>(
  ({ appLayoutInternals }: AppLayoutToolbarImplementationProps, ref) => (
    <ToolbarSlot ref={ref}>
      <BreadcrumbsSlot
        ownBreadcrumbs={appLayoutInternals.breadcrumbs}
        discoveredBreadcrumbs={appLayoutInternals.discoveredBreadcrumbs}
      />
    </ToolbarSlot>
  )
);

export const NotificationsSkeleton = React.forwardRef<HTMLElement, AppLayoutNotificationsImplementationProps>(
  (props: AppLayoutNotificationsImplementationProps, ref) => <NotificationsSlot ref={ref} />
);
