// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext } from 'react';

import { awsuiPluginsInternal } from '../../internal/plugins/api';

interface BreadcrumbsSlotContextType {
  isInToolbar: boolean;
}

export const BreadcrumbsSlotContext =
  awsuiPluginsInternal.sharedReactContexts.createContext<BreadcrumbsSlotContextType>(React, 'BreadcrumbsSlotContext');

export const AppLayoutVisibilityContext = createContext<{
  isIntersecting: boolean;
  isToolbarLayout?: boolean; // Add this property
}>({ isIntersecting: false });

export const AppLayoutToolbarPublicContext = awsuiPluginsInternal.sharedReactContexts.createContext<boolean>(
  React,
  'AppLayoutToolbarPublicContext'
);
