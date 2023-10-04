// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import SelectWrapper from '../../../lib/components/test-utils/selectors/select';
import AutosuggestWrapper from '../../../lib/components/test-utils/selectors/autosuggest';

interface APIResponse {
  items: NonNullable<Array<any>>;
  hasNextPage: boolean;
}
interface PendingRequest {
  resolve: (value: APIResponse) => void;
  reject: (reason: any) => void;
  params: {
    filteringText: string;
    pageNumber: number;
  };
}
interface ExtendedWindow extends Window {
  __pendingRequests: Array<PendingRequest>;
}
declare const window: ExtendedWindow;

export const DEBOUNCE_FILTERING_DELAY = 300;
export const RESPONSE_PAGE_SIZE = 20;

export class AsyncDropdownPage extends BasePageObject {
  constructor(
    browser: ConstructorParameters<typeof BasePageObject>[0],
    protected optionsContainerSelector: string,
    protected responsePageSize: number
  ) {
    super(browser);
  }

  getLatestRequestParams() {
    return this.browser.execute(() => {
      const latestRequest = window.__pendingRequests[window.__pendingRequests.length - 1];
      return latestRequest ? latestRequest.params : null;
    });
  }

  async scrollDropdown(offset: number) {
    await this.elementScrollTo(this.optionsContainerSelector, { top: offset });
    await this.waitForJsTimers();
  }

  async getDropdownScrollPosition() {
    const { top } = await this.getElementScroll(this.optionsContainerSelector);
    return top;
  }

  async getDropdownPosition() {
    const boundingBox = await this.getBoundingBox(this.optionsContainerSelector);
    return boundingBox;
  }

  async respondWith(offset: number, hasNextPage: boolean) {
    const items = Array.from({ length: this.responsePageSize }, (_, i) => {
      const index = i + offset;
      return { value: `${index}`, label: `Option ${index}` };
    });
    await this.browser.execute(
      function (items, hasNextPage) {
        const response = window.__pendingRequests.shift()!;
        response.resolve({ items: items, hasNextPage: hasNextPage });
      },
      items,
      hasNextPage
    );
  }

  async reject() {
    await this.browser.execute(() => {
      const response = window.__pendingRequests.shift();
      response && response.reject(new Error('Mock response failure'));
    });
  }
}

export default class AsyncDropdownComponentPage extends AsyncDropdownPage {
  constructor(
    browser: ConstructorParameters<typeof BasePageObject>[0],
    protected control: SelectWrapper | AutosuggestWrapper,
    expandToViewport = false
  ) {
    super(browser, control.findDropdown({ expandToViewport }).findOptionsContainer().toSelector(), RESPONSE_PAGE_SIZE);
  }

  async getStatusText() {
    const statusIndicatorSelector = this.control.findStatusIndicator().toSelector();
    const exists = await this.isExisting(statusIndicatorSelector);
    if (!exists) {
      return null;
    }
    return this.getText(statusIndicatorSelector).then(value => value.trim());
  }

  async assertStatusText(expected: string | null) {
    await this.browser.waitUntil(async () => (await this.getStatusText()) === expected, {
      timeout: 2500,
      timeoutMsg: `Status text should be "${expected}"`,
    });
  }

  async getOptionsCount() {
    const count = await this.getElementsCount(this.control.findDropdown().findOptions().toSelector());
    return count;
  }

  async getHighlightedPosition() {
    const optionSelector = this.control.findDropdown().findHighlightedOption().toSelector();
    const boundingBox = await this.getBoundingBox(optionSelector);
    return boundingBox;
  }

  async enableExpandToViewport() {
    await this.click('#expand-to-viewport');
  }

  async enableVirtualScrolling() {
    await this.click('#virtual');
  }
}
