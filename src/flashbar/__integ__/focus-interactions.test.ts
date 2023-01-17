// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { testFocusInteractions } from './common';
import { setupTest } from './pages/interactive-page';

testFocusInteractions({ initialCount: 5 });

test(
  'adding flash with ariaRole="alert" to the top moves focus to the new flash',
  setupTest(async page => {
    await page.addErrorFlashToTop();
    return expect(page.isFlashFocused(1)).resolves.toBe(true);
  })
);
