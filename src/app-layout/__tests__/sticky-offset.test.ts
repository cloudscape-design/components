// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getStickyOffsetVars } from '../../../lib/components/app-layout/utils/sticky-offsets';
import globalVars from '../../../lib/components/internal/styles/global-vars';

const HEADER = 5;
const FOOTER = 10;
const NOTIFICATIONS = '44px';
const MOBILE_BAR = '28px';

describe('computes vertical offsets', () => {
  test('header and footer only', () => {
    expect(getStickyOffsetVars(HEADER, FOOTER, '0px', '0px', false, false)).toEqual({
      [globalVars.stickyVerticalTopOffset]: `calc(${HEADER}px + 0px)`,
      [globalVars.stickyVerticalBottomOffset]: `${FOOTER}px`,
    });
  });

  test('with sticky notifications on desktop', () => {
    expect(getStickyOffsetVars(HEADER, FOOTER, NOTIFICATIONS, MOBILE_BAR, false, false)).toEqual({
      [globalVars.stickyVerticalTopOffset]: `calc(${HEADER}px + ${NOTIFICATIONS})`,
      [globalVars.stickyVerticalBottomOffset]: `${FOOTER}px`,
    });
  });

  test('with sticky notifications on mobile', () => {
    expect(getStickyOffsetVars(HEADER, FOOTER, NOTIFICATIONS, MOBILE_BAR, false, true)).toEqual({
      [globalVars.stickyVerticalTopOffset]: `calc(${HEADER}px + ${MOBILE_BAR})`,
      [globalVars.stickyVerticalBottomOffset]: `${FOOTER}px`,
    });
  });

  test('disableBodyScroll mode on desktop', () => {
    expect(getStickyOffsetVars(HEADER, FOOTER, NOTIFICATIONS, MOBILE_BAR, true, false)).toEqual({
      [globalVars.stickyVerticalTopOffset]: `calc(0px + ${NOTIFICATIONS})`,
      [globalVars.stickyVerticalBottomOffset]: '0px',
    });
  });

  test('disableBodyScroll mode on mobile', () => {
    expect(getStickyOffsetVars(HEADER, FOOTER, NOTIFICATIONS, MOBILE_BAR, true, true)).toEqual({
      [globalVars.stickyVerticalTopOffset]: `calc(0px + ${MOBILE_BAR})`,
      [globalVars.stickyVerticalBottomOffset]: '0px',
    });
  });
});
