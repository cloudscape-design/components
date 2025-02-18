// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext } from 'react';

import { getGlobalFlag } from '@cloudscape-design/component-toolkit/internal';

import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import { AppLayoutToolbarPublicContext } from '../visual-refresh-toolbar/contexts';

export const useAppLayoutToolbarEnabled = () => {
  const isRefresh = useVisualRefresh();
  return isRefresh && (getGlobalFlag('appLayoutWidget') || getGlobalFlag('appLayoutToolbar'));
};

export const useAppLayoutToolbarPublicEnabled = () => {
  const isToolbarPrivate = useAppLayoutToolbarEnabled();
  const isToolbarPublic = useContext(AppLayoutToolbarPublicContext) ?? false;

  return isToolbarPublic || isToolbarPrivate;
};
