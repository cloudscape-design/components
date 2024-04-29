// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { computeOffset } from '../../../lib/components/container/use-sticky-header';
import globalVars from '../../../lib/components/internal/styles/global-vars';

describe('computeOffset', () => {
  test('should calculate offset for mobile', () => {
    const result = computeOffset({
      isMobile: true,
      __stickyOffset: 0,
      __mobileStickyOffset: 10,
      hasInnerOverflowParents: false,
    });

    expect(result).toBe(`calc(var(${globalVars.stickyVerticalTopOffset}, 0px) + -10px)`);
  });

  test('should calculate offset for non-mobile without inner overflow parents', () => {
    const result = computeOffset({
      isMobile: false,
      __mobileStickyOffset: 10,
      hasInnerOverflowParents: false,
    });

    expect(result).toBe(`calc(var(${globalVars.stickyVerticalTopOffset}, 0px) + 0px)`);
  });

  test('should calculate offset for non-mobile with inner overflow parents', () => {
    const result = computeOffset({
      isMobile: false,
      __mobileStickyOffset: 20,
      hasInnerOverflowParents: true,
    });

    expect(result).toBe('0px');
  });

  test('should calculate offset for non-mobile using __stickyOffset and with inner overflow parents', () => {
    const result = computeOffset({
      isMobile: false,
      __stickyOffset: 10,
      hasInnerOverflowParents: true,
    });

    expect(result).toBe('10px');
  });

  test('should calculate offset for with __stickyOffset, stickyOffsetTop and __mobileStickyOffset', () => {
    const result = computeOffset({
      isMobile: true,
      __stickyOffset: 100,
      __mobileStickyOffset: 40,
      hasInnerOverflowParents: false,
    });

    expect(result).toBe(`calc(var(${globalVars.stickyVerticalTopOffset}, 0px) + 60px)`);
  });
});
