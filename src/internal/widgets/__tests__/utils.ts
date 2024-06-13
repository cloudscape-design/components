// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { awsuiGlobalFlagsSymbol, FlagsHolder } from '../../../../lib/components/internal/utils/global-flags';

declare const window: Window & FlagsHolder;

export function describeWithAppLayoutFeatureFlagEnabled(tests: () => void) {
  describe('when feature flag is active', () => {
    beforeEach(() => {
      window[awsuiGlobalFlagsSymbol] = { appLayoutWidget: true };
    });

    afterEach(() => {
      delete window[awsuiGlobalFlagsSymbol];
    });

    tests();
  });
}
