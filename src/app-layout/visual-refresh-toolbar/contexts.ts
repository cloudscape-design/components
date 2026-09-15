// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BreadcrumbGroupProps } from '../../breadcrumb-group/interfaces';
import { awsuiPluginsInternal } from '../../internal/plugins/api';
import { BreadcrumbsGlobalRegistration } from '../../internal/plugins/controllers/breadcrumbs';

export interface BreadcrumbsSlotContextType {
  isInToolbar: boolean;
  registerBreadcrumbs?: (props: BreadcrumbGroupProps) => BreadcrumbsGlobalRegistration<BreadcrumbGroupProps>;
}

export const BreadcrumbsSlotContext =
  awsuiPluginsInternal.sharedReactContexts.createContext<BreadcrumbsSlotContextType>(React, 'BreadcrumbsSlotContext');

export const AppLayoutVisibilityContext = awsuiPluginsInternal.sharedReactContexts.createContext<boolean>(
  React,
  'AppLayoutVisibilityContext'
);

export const AppLayoutToolbarPublicContext = awsuiPluginsInternal.sharedReactContexts.createContext<boolean>(
  React,
  'AppLayoutToolbarPublicContext'
);
