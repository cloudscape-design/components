// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { setGlobalFlag } from '@cloudscape-design/component-toolkit/internal/testing';

export function describeWithAppLayoutFeatureFlagEnabled(tests: () => void) {
  describe('when feature flag is active', () => {
    beforeEach(() => {
      setGlobalFlag('appLayoutWidget', true);
    });

    afterEach(() => {
      setGlobalFlag('appLayoutWidget', undefined);
    });

    tests();
  });
}
