// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import { DropdownPageObject } from './dropdown-page-object';

function setupChildTest(
  url: string,
  parentDropdownId: string,
  childDropdownId: string,
  testFn: (parentDropdown: DropdownPageObject, childDropdown: DropdownPageObject) => Promise<void>
) {
  return useBrowser(async browser => {
    await browser.url(url);
    const parentDropdown = new DropdownPageObject(parentDropdownId, browser);
    await parentDropdown.waitForVisible(parentDropdown.getDropdown());
    await parentDropdown.click(parentDropdown.getTrigger());

    const childDropdownObj = new DropdownPageObject(childDropdownId, browser);
    await childDropdownObj.waitForVisible(childDropdownObj.getDropdown());
    await childDropdownObj.click(childDropdownObj.getTrigger());
    await testFn(parentDropdown, childDropdownObj);
  });
}

describe('Child dropdown', () => {
  test(
    'opens to the bottom right',
    setupChildTest(
      '#/light/dropdown/interior-fitting',
      'parentDropdown1',
      'childDropdown1',
      async (parentDropdown, childDropdown) => {
        const parentDropdownPosition = await parentDropdown.getBoundingBox(parentDropdown.getOpenDropdown());
        const childDropdownPosition = await childDropdown.getBoundingBox(childDropdown.getOpenDropdown());
        const childTriggerPosition = await childDropdown.getBoundingBox(childDropdown.getTrigger());
        expect(childDropdownPosition.right).toBeGreaterThan(parentDropdownPosition.right);
        expect(childTriggerPosition.bottom).toBeLessThan(childDropdownPosition.bottom);
      }
    )
  );
  test(
    'opens to the bottom left',
    setupChildTest(
      '#/light/dropdown/interior-fitting',
      'parentDropdown2',
      'childDropdown2',
      async (parentDropdown, childDropdown) => {
        const parentDropdownPosition = await parentDropdown.getBoundingBox(parentDropdown.getOpenDropdown());
        const childDropdownPosition = await childDropdown.getBoundingBox(childDropdown.getOpenDropdown());
        const childTriggerPosition = await childDropdown.getBoundingBox(childDropdown.getTrigger());
        expect(childDropdownPosition.left).toBeLessThan(parentDropdownPosition.left);
        expect(childTriggerPosition.bottom).toBeLessThan(childDropdownPosition.bottom);
      }
    )
  );
  test(
    'opens to the top right',
    setupChildTest(
      '#/light/dropdown/interior-fitting',
      'parentDropdown3',
      'childDropdown3',
      async (parentDropdown, childDropdown) => {
        const parentDropdownPosition = await parentDropdown.getBoundingBox(parentDropdown.getOpenDropdown());
        const childDropdownPosition = await childDropdown.getBoundingBox(childDropdown.getOpenDropdown());
        const childTriggerPosition = await childDropdown.getBoundingBox(childDropdown.getTrigger());
        expect(childDropdownPosition.right).toBeGreaterThan(parentDropdownPosition.right);
        expect(childTriggerPosition.top).toBeGreaterThan(childDropdownPosition.top);
      }
    )
  );
  test(
    'opens to the top left',
    setupChildTest(
      '#/light/dropdown/interior-fitting',
      'parentDropdown4',
      'childDropdown4',
      async (parentDropdown, childDropdown) => {
        const parentDropdownPosition = await parentDropdown.getBoundingBox(parentDropdown.getOpenDropdown());
        const childDropdownPosition = await childDropdown.getBoundingBox(childDropdown.getOpenDropdown());
        const childTriggerPosition = await childDropdown.getBoundingBox(childDropdown.getTrigger());
        expect(childDropdownPosition.left).toBeLessThan(parentDropdownPosition.left);
        expect(childTriggerPosition.top).toBeGreaterThan(childDropdownPosition.top);
      }
    )
  );
  test(
    'opens to the bottom right and wraps text',
    setupChildTest(
      '#/light/dropdown/interior-with-wrapping',
      'parentDropdown5',
      'childDropdown5',
      async (parentDropdown, childDropdown) => {
        const parentDropdownPosition = await parentDropdown.getBoundingBox(parentDropdown.getOpenDropdown());
        const childDropdownPosition = await childDropdown.getBoundingBox(childDropdown.getOpenDropdown());
        const childTriggerPosition = await childDropdown.getBoundingBox(childDropdown.getTrigger());
        expect(childDropdownPosition.right).toBeGreaterThan(parentDropdownPosition.right);
        expect(childTriggerPosition.bottom).toBeLessThan(childDropdownPosition.bottom);
      }
    )
  );
  test(
    'opens to the bottom right and wraps text',
    setupChildTest(
      '#/light/dropdown/interior-with-wrapping',
      'parentDropdown5',
      'childDropdown5',
      async (parentDropdown, childDropdown) => {
        const parentDropdownPosition = await parentDropdown.getBoundingBox(parentDropdown.getOpenDropdown());
        const childDropdownPosition = await childDropdown.getBoundingBox(childDropdown.getOpenDropdown());
        const childTriggerPosition = await childDropdown.getBoundingBox(childDropdown.getTrigger());
        expect(childDropdownPosition.right).toBeGreaterThan(parentDropdownPosition.right);
        expect(childTriggerPosition.bottom).toBeLessThan(childDropdownPosition.bottom);
      }
    )
  );
  test(
    'opens to the bottom right and wraps text',
    setupChildTest(
      '#/light/dropdown/interior-with-wrapping',
      'parentDropdown6',
      'childDropdown6',
      async (parentDropdown, childDropdown) => {
        const parentDropdownPosition = await parentDropdown.getBoundingBox(parentDropdown.getOpenDropdown());
        const childDropdownPosition = await childDropdown.getBoundingBox(childDropdown.getOpenDropdown());
        const childTriggerPosition = await childDropdown.getBoundingBox(childDropdown.getTrigger());
        expect(childDropdownPosition.left).toBeLessThan(parentDropdownPosition.left);
        expect(childTriggerPosition.top).toBeGreaterThan(childDropdownPosition.top);
      }
    )
  );
});
