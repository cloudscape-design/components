// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { computeOffset } from '../../../lib/components/container/use-sticky-header';
import globalVars from '../../../lib/components/internal/styles/global-vars';
import * as tokens from '../../../lib/components/internal/generated/styles/tokens';

describe('computeOffset', () => {
  test('should calculate offset for mobile outside overflow parent', () => {
    const result = computeOffset({
      isMobile: true,
      __mobileStickyOffset: 10,
      hasInnerOverflowParents: false,
    });

    expect(result).toBe(`calc(var(${globalVars.stickyVerticalTopOffset}, 0px) + -10px + 0px)`);
  });

  test('should calculate offset for mobile inside overflow parent', () => {
    const result = computeOffset({
      isMobile: true,
      __mobileStickyOffset: 10,
      hasInnerOverflowParents: true,
    });

    expect(result).toBe('-10px');
  });

  test('should apply explicit sticky offset inside overflow parent', () => {
    const result = computeOffset({
      isMobile: true,
      __stickyOffset: 30,
      __mobileStickyOffset: 10,
      hasInnerOverflowParents: true,
    });

    expect(result).toBe('20px');
  });

  test('should calculate offset for non-mobile without inner overflow parents', () => {
    const result = computeOffset({
      isMobile: false,
      __mobileStickyOffset: 10,
      hasInnerOverflowParents: false,
    });

    expect(result).toBe(`calc(var(${globalVars.stickyVerticalTopOffset}, 0px) + 0px + 0px)`);
  });

  test('should calculate include additional offset', () => {
    const result = computeOffset({
      isMobile: false,
      __mobileStickyOffset: 10,
      hasInnerOverflowParents: false,
      __additionalOffset: true,
    });

    expect(result).toBe(`calc(var(${globalVars.stickyVerticalTopOffset}, 0px) + 0px + ${tokens.spaceScaledS})`);
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

    expect(result).toBe('60px');
  });

  test('should apply zero sticky offset value', () => {
    const result = computeOffset({
      isMobile: false,
      __stickyOffset: 0,
      hasInnerOverflowParents: false,
    });

    expect(result).toBe('0px');
  });
});
