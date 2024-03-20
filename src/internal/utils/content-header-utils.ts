// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getGlobalFlag } from './global-flags';

export const shouldRemoveHighContrastHeader = (): boolean => !!getGlobalFlag('removeHighContrastHeader');
// export const getContentHeaderClassName = (): string =>
//   shouldRemoveHighContrastHeader() ? '' : 'awsui-context-content-header';
// export const getContentHeaderClassName = (isDarkHeader?: boolean): string => {
//   isDarkHeader ? 'awsui-context-content-header' : '';
// }

export const getContentHeaderClassName = (isDarkHeader?: boolean, headerType?: string): string => {
  let className = '';

  if (isDarkHeader || headerType === 'homepage' || headerType === 'hero') {
    className += 'awsui-context-content-header ';
  }

  if (headerType === 'documentation') {
    className += '';
  }

  return className.trim();
};
