// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import { SerializedAXNode } from 'puppeteer-core';

type PuppeteerBrowser = Awaited<ReturnType<WebdriverIO.Browser['getPuppeteer']>>;

export const findAXNode = (
  node: SerializedAXNode,
  predicate: (node: SerializedAXNode) => boolean
): SerializedAXNode | null => {
  if (predicate(node)) {
    return node;
  }
  for (const child of node.children ?? []) {
    const result = findAXNode(child, predicate);
    if (result) {
      return result;
    }
  }
  return null;
};

export class AccessibilityPage extends BasePageObject {
  protected puppeteer: PuppeteerBrowser | null = null;

  constructor(protected browser: WebdriverIO.Browser) {
    super(browser);
  }

  protected async getPuppeteer(): Promise<PuppeteerBrowser> {
    if (this.puppeteer) {
      return Promise.resolve(this.puppeteer);
    }
    this.puppeteer = await this.browser.getPuppeteer();
    return this.puppeteer;
  }

  async getAccessibilityTree(rootSelector?: string): Promise<SerializedAXNode> {
    const puppeteer = await this.getPuppeteer();
    const [currentPage] = await puppeteer.pages();

    const root = rootSelector ? await currentPage.$(rootSelector) : null;
    return currentPage.accessibility.snapshot({ root: root ?? undefined, interestingOnly: false });
  }
}
