// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { setFunnelMetrics, setPerformanceMetrics } from '../../../../lib/components/internal/analytics';

export const mockedFunnelInteractionId = 'mocked-funnel-id';
export function mockFunnelMetrics() {
  setFunnelMetrics({
    funnelStart: jest.fn(() => mockedFunnelInteractionId),
    funnelError: jest.fn(),
    funnelComplete: jest.fn(),
    funnelSuccessful: jest.fn(),
    funnelCancelled: jest.fn(),
    funnelChange: jest.fn(),
    funnelStepChange: jest.fn(),
    funnelStepStart: jest.fn(),
    funnelStepComplete: jest.fn(),
    funnelStepNavigation: jest.fn(),
    funnelStepError: jest.fn(),
    funnelSubStepStart: jest.fn(),
    funnelSubStepComplete: jest.fn(),
    funnelSubStepError: jest.fn(),
    helpPanelInteracted: jest.fn(),
    externalLinkInteracted: jest.fn(),
  });
}

export function mockPerformanceMetrics() {
  setPerformanceMetrics({ tableInteraction: jest.fn() });
}

export function mockInnerText() {
  if (!('innerText' in HTMLElement.prototype)) {
    // JSDom does not support the `innerText` property. For tests, `textContent` is usually close enough.

    beforeEach(() =>
      Object.defineProperty(HTMLElement.prototype, 'innerText', {
        get() {
          return this.textContent;
        },
        set(v) {
          this.textContent = v;
        },
        configurable: true,
      })
    );

    afterEach(() => delete (HTMLElement.prototype as Partial<HTMLElement>).innerText);
  }
}
