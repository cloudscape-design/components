// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook } from '../../../../__tests__/render-hook';
import * as tokens from '../../../generated/styles/tokens';
import { useMobile } from '../../../hooks/use-mobile';
import globalVars from '../../../styles/global-vars';
import { useStickyPosition } from '../use-sticky-position';

jest.mock('../../../hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(false),
}));

const globalOffset = `var(${globalVars.stickyVerticalTopOffset}, 0px)`;

afterEach(() => {
  document.body.innerHTML = '';
  jest.mocked(useMobile).mockReturnValue(false);
});

describe('sticky top offset', () => {
  test('is not applied when the header is not sticky', () => {
    expect(stickyStylesFor({ sticky: false })).toEqual({});
  });

  test('sits below the global offset on mobile, moved up by the mobile offset', () => {
    expect(stickyTopFor({ mobile: true, mobileOffset: 10 })).toBe(`calc(${globalOffset} + -10px + 0px)`);
  });

  test('ignores the mobile offset outside mobile', () => {
    expect(stickyTopFor({ mobileOffset: 10 })).toBe(`calc(${globalOffset} + 0px + 0px)`);
  });

  test('adds the additional offset', () => {
    expect(stickyTopFor({ mobileOffset: 10, additionalOffset: true })).toBe(
      `calc(${globalOffset} + 0px + ${tokens.spaceScaledS})`
    );
  });

  test('uses an explicit offset instead of the global offset', () => {
    expect(stickyTopFor({ mobile: true, offset: 100, mobileOffset: 40 })).toBe('60px');
  });

  test('uses an explicit zero offset instead of the global offset', () => {
    expect(stickyTopFor({ offset: 0 })).toBe('0px');
  });

  describe('inside a scrolling parent', () => {
    test('drops the global offset', () => {
      expect(stickyTopFor({ mobileOffset: 20, parent: 'scrolling-div' })).toBe('0px');
    });

    test('drops the global offset on mobile, keeping the mobile offset', () => {
      expect(stickyTopFor({ mobile: true, mobileOffset: 10, parent: 'scrolling-div' })).toBe('-10px');
    });

    test('applies an explicit offset', () => {
      expect(stickyTopFor({ offset: 10, parent: 'scrolling-div' })).toBe('10px');
    });

    test('applies an explicit offset on mobile, moved up by the mobile offset', () => {
      expect(stickyTopFor({ mobile: true, offset: 30, mobileOffset: 10, parent: 'scrolling-div' })).toBe('20px');
    });
  });

  test('keeps the global offset when the scrolling parent is the app layout <main>', () => {
    expect(stickyTopFor({ parent: 'scrolling-main' })).toBe(`calc(${globalOffset} + 0px + 0px)`);
  });
});

interface Scenario {
  sticky?: boolean;
  mobile?: boolean;
  offset?: number;
  mobileOffset?: number;
  additionalOffset?: boolean;
  parent?: 'none' | 'scrolling-div' | 'scrolling-main';
}

function stickyTopFor(scenario: Omit<Scenario, 'sticky'>) {
  return stickyStylesFor({ ...scenario, sticky: true }).style?.top;
}

function stickyStylesFor({
  sticky,
  mobile = false,
  offset,
  mobileOffset,
  additionalOffset,
  parent = 'none',
}: Scenario) {
  jest.mocked(useMobile).mockReturnValue(mobile);
  const root = document.createElement('div');
  const header = document.createElement('div');
  root.appendChild(header);
  mountIn(root, parent);

  const { result } = renderHook(() =>
    useStickyPosition({ current: root }, { current: header }, { sticky, offset, mobileOffset, additionalOffset })
  );
  return result.current.stickyStyles;
}

function mountIn(root: HTMLElement, parent: Scenario['parent']) {
  if (parent === 'none') {
    document.body.appendChild(root);
    return;
  }
  const scrollingParent = document.createElement(parent === 'scrolling-main' ? 'main' : 'div');
  scrollingParent.style.overflow = 'auto';
  scrollingParent.appendChild(root);
  document.body.appendChild(scrollingParent);
}
