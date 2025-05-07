// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { awsuiPluginsInternal } from '../../internal/plugins/api';
import { useAppLayout } from './use-app-layout';

interface BreadcrumbsSlotContextType {
  isInToolbar: boolean;
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

export const AppLayoutStateContext = awsuiPluginsInternal.sharedReactContexts.createContext<{
  state: ReturnType<typeof useAppLayout> | null;
  setState: (value: ReturnType<typeof useAppLayout>) => void;
}>(React, 'AppLayoutStateContext');
