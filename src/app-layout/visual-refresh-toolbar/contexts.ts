// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { awsuiPluginsInternal } from '../../internal/plugins/api';

interface BreadcrumbsSlotContextType {
  isInToolbar: boolean;
}

export const BreadcrumbsSlotContext =
  awsuiPluginsInternal.sharedReactContexts.createContext<BreadcrumbsSlotContextType>(React, 'BreadcrumbsSlotContext');

export const AppLayoutVisibilityContext = awsuiPluginsInternal.sharedReactContexts.createContext<boolean>(
  React,
  'AppLayoutVisibilityContext'
);
