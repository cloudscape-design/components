// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import globalVars from '../../internal/styles/global-vars';

export function getStickyOffsetVars(
  headerHeight: number,
  footerHeight: number,
  stickyNotificationsHeight: string,
  mobileToolbarHeight: string,
  disableBodyScroll: boolean,
  isMobile: boolean
) {
  return {
    [globalVars.stickyVerticalTopOffset]: `calc(${!disableBodyScroll ? headerHeight : 0}px + ${
      isMobile ? mobileToolbarHeight : stickyNotificationsHeight
    })`,
    [globalVars.stickyVerticalBottomOffset]: `${!disableBodyScroll ? footerHeight : 0}px`,
  };
}
