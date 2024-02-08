// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getGlobalFlag } from './global-flags';
//import { useAppLayoutInternals } from '../../app-layout/visual-refresh/context';

export const shouldRemoveHighContrastHeader = (): boolean => !!getGlobalFlag('removeHighContrastHeader');
export const getContentHeaderClassName = (isDarkHeader?: boolean): string => {
  return shouldRemoveHighContrastHeader() && !isDarkHeader ? '' : 'awsui-context-content-header';
};
