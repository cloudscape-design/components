// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import BasePageExtendedObject from './base-page-ext';

interface ExtendedWindow extends Window {
  __flushServerResponse: () => void;
}
declare const window: ExtendedWindow;

export class AsyncResponsePage extends BasePageExtendedObject {
  flushResponse() {
    return this.browser.execute(() => window.__flushServerResponse());
  }
}
