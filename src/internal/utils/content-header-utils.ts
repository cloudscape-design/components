// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getGlobalFlag } from './global-flags';

export const highContrastHeaderClassName = 'awsui-context-content-header';
export const shouldRemoveHighContrastHeader = (): boolean => !!getGlobalFlag('removeHighContrastHeader');
export const getContentHeaderClassName = (): string =>
  shouldRemoveHighContrastHeader() ? '' : highContrastHeaderClassName;
