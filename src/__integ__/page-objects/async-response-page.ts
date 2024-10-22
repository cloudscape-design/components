// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

interface ExtendedWindow extends Window {
  __flushServerResponse: () => void;
}
declare const window: ExtendedWindow;

export class AsyncResponsePage extends BasePageObject {
  flushResponse() {
    return this.browser.execute(() => window.__flushServerResponse());
  }
}
