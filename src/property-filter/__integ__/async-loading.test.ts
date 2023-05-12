// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import qs from 'qs';

import { PropertyFilterProps } from '../../../lib/components/property-filter/interfaces';
import styles from '../../../lib/components/property-filter/styles.selectors.js';

interface ExtendedWindow {
  loadItemsCalls: PropertyFilterProps.LoadItemsDetail[];
}
declare let window: ExtendedWindow;

const wrapper = createWrapper().findPropertyFilter();
const inputSelector = wrapper.findNativeInput().toSelector();
const popoverWrapper = createWrapper(wrapper.findTokens().get(1).toSelector()).findPopover();
const propertyEditWrapper = popoverWrapper
  .findContent()
  .findByClassName(styles['token-editor-field-property'])
  .findSelect();
const valueEditWrapper = popoverWrapper
  .findContent()
  .findByClassName(styles['token-editor-field-value'])
  .findAutosuggest();

class AsyncPropertyFilterPage extends BasePageObject {
  expectLoadItemsEvents = async (expected: PropertyFilterProps.LoadItemsDetail[]) => {
    await this.waitForAssertion(async () => {
      const loadItemsCalls = await this.browser.execute(() => {
        const loadItemsCalls = window.loadItemsCalls;
        return loadItemsCalls;
      });
      expect(loadItemsCalls).toEqual(expected);
    });
  };
  openFilteringInput = async () => {
    await this.click(inputSelector);
  };
  typeInFilteringInput = async (value: string | string[]) => {
    await this.openFilteringInput();
    await this.keys(value);
  };
  openTokenEditor = async () => {
    await this.click(popoverWrapper.findTrigger().toSelector());
  };
  closeTokenEditor = async () => {
    await this.click(popoverWrapper.findDismissButton().toSelector());
  };
  openPropertyEdit = async () => {
    await this.click(propertyEditWrapper.findTrigger().toSelector());
  };
  openValueEdit = async () => {
    await this.click(valueEditWrapper.findNativeInput().toSelector());
  };
  typeInValueEdit = async (value: string) => {
    await this.openValueEdit();
    await this.keys(value);
  };
}

function setupTest(
  asyncProperties: boolean,
  token: 'freeText' | 'property',
  testFn: (page: AsyncPropertyFilterPage) => Promise<void>
) {
  return useBrowser(async browser => {
    const page = new AsyncPropertyFilterPage(browser);
    const query = qs.stringify({
      asyncProperties,
      token,
    });
    await browser.url(`#/light/property-filter/async-loading.integ?${query}`);
    await page.waitForVisible('main');
    await testFn(page);
  });
}

type Command =
  | 'open-filtering-input'
  | 'type-in-filtering-input'
  | 'open-property-edit-select'
  | 'open-value-edit'
  | 'type-in-value-edit'
  | 'open-token-editor'
  | 'close-token-editor';
type Scenario = { command: Command; param?: string; result: PropertyFilterProps.LoadItemsDetail[] }[];
type TestCase = [string, boolean, 'freeText' | 'property', Scenario];

const filteringProperty: PropertyFilterProps.FilteringProperty = {
  key: 'property',
  operators: ['=', '!=', '>', '<', '<=', '>='],
  propertyLabel: 'label',
  groupValuesLabel: `Label values`,
};
const testCases: TestCase[] = [
  [
    'requests for properties and values from the search input with asyncProperties set',
    true,
    'property',
    [
      { command: 'open-filtering-input', result: [{ firstPage: true, samePage: false, filteringText: '' }] },
      {
        command: 'type-in-filtering-input',
        param: '1',
        result: [
          { firstPage: true, samePage: false, filteringText: '' },
          { firstPage: true, samePage: false, filteringText: '1' },
        ],
      },
    ],
  ],
  [
    'request for property specific suggestions from the search input',
    false,
    'property',
    [
      { command: 'open-filtering-input', result: [] },
      {
        command: 'type-in-filtering-input',
        param: 'label=',
        result: [
          { filteringText: 'l', firstPage: false, samePage: false },
          { filteringProperty, filteringOperator: '=', filteringText: '', firstPage: true, samePage: false },
        ],
      },
    ],
  ],
  [
    'request for properties from the property selector in the edit popover',
    true,
    'property',
    [
      { command: 'open-token-editor', result: [] },
      { command: 'open-property-edit-select', result: [{ firstPage: true, samePage: false, filteringText: '' }] },
    ],
  ],
  [
    'no request for properties from the property selector in the edit popover without asyncProperties set',
    false,
    'property',
    [
      { command: 'open-token-editor', result: [] },
      { command: 'open-property-edit-select', result: [] },
    ],
  ],
  [
    'request for values from the value selector in the edit popover of a property token',
    true,
    'property',
    [
      { command: 'open-token-editor', result: [] },
      {
        command: 'open-value-edit',
        result: [{ firstPage: true, samePage: false, filteringText: '', filteringProperty }],
      },
    ],
  ],
  [
    'no request for values from the value selector in the edit popover of a free text token',
    true,
    'freeText',
    [
      { command: 'open-token-editor', result: [] },
      { command: 'open-value-edit', result: [] },
    ],
  ],
];

test.each<TestCase>(testCases)('%p', (_, asyncProperties, token, scenario) =>
  setupTest(asyncProperties, token, async page => {
    for (let i = 0; i < scenario.length; i++) {
      const { command, result, param = '' } = scenario[i];
      switch (command) {
        case 'open-filtering-input': {
          await page.openFilteringInput();
          break;
        }
        case 'type-in-filtering-input': {
          await page.typeInFilteringInput(param.split(''));
          break;
        }
        case 'open-token-editor': {
          await page.openTokenEditor();
          break;
        }
        case 'open-property-edit-select': {
          await page.openPropertyEdit();
          break;
        }
        case 'open-value-edit': {
          await page.openValueEdit();
          break;
        }
        case 'type-in-value-edit': {
          await page.typeInValueEdit(param);
          break;
        }
        case 'close-token-editor': {
          await page.closeTokenEditor();
          break;
        }
      }
      await page.waitForJsTimers(500);
      await page.expectLoadItemsEvents(result);
    }
  })()
);
