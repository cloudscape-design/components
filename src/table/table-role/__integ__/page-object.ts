// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

interface ExtendedWindow extends Window {
  refreshItems: () => void;
}
declare const window: ExtendedWindow;

export class GridNavigationPageObject extends BasePageObject {
  async refreshItems() {
    await this.browser.execute(() => window.refreshItems());
  }
}
