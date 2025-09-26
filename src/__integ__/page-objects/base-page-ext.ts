// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

interface ExtendedWindow extends Window {
  reactVersion: string;
}
declare const window: ExtendedWindow;

export default class BasePageExtendedObject extends BasePageObject {
  constructor(browser: ConstructorParameters<typeof BasePageObject>[0]) {
    super(browser);
  }
  public getReactVersion() {
    return this.browser.execute(() => window.reactVersion);
  }
}
