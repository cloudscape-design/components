// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { setFunnelMetrics } from '../../../../lib/components/internal/analytics';

export const mockedFunnelInteractionId = 'mocked-funnel-id';
export function mockFunnelMetrics() {
  setFunnelMetrics({
    funnelStart: jest.fn(() => mockedFunnelInteractionId),
    funnelError: jest.fn(),
    funnelComplete: jest.fn(),
    funnelSuccessful: jest.fn(),
    funnelCancelled: jest.fn(),
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
