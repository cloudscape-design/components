// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

test(
  'contains version info',
  useBrowser(async browser => {
    await browser.url('/');
    await expect(browser.execute(() => (window as any).awsuiVersions)).resolves.toEqual({
      components: [expect.any(String)],
    });
  })
);
