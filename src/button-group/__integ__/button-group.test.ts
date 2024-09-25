// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const buttonGroup = createWrapper().findButtonGroup();
const likeButton = buttonGroup.findButtonById('like');
const dislikeButton = buttonGroup.findButtonById('dislike');
const copyButton = buttonGroup.findButtonById('copy');
const sendButton = buttonGroup.findButtonById('send');
const actionsMenu = buttonGroup.findMenuById('more-actions');

function setup(options: { dropdownExpandToViewport?: boolean }, testFn: (page: BasePageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    const query = new URLSearchParams({
      dropdownExpandToViewport: String(options.dropdownExpandToViewport),
    });
    await browser.url(`/#/light/button-group/test?${query.toString()}`);
    await testFn(page);
  });
}

test(
  'shows popover after clicking on inline button',
  setup({}, async page => {
    await page.click(likeButton.toSelector());
    await page.waitForVisible(buttonGroup.findTooltip().toSelector());
    await expect(page.getText(buttonGroup.findTooltip().toSelector())).resolves.toBe('Liked');
    await expect(page.getText('#last-clicked')).resolves.toBe('like');
  })
);

test(
  'can click in-menu item',
  setup({}, async page => {
    await page.click(actionsMenu.toSelector());
    await page.click(actionsMenu.findItemById('edit').toSelector());
    await expect(page.getText('#last-clicked')).resolves.toBe('edit');
  })
);

test.each([false, true])(
  'can navigate to menu and back with keyboard, dropdownExpandToViewport=%s',
  async dropdownExpandToViewport => {
    await setup({ dropdownExpandToViewport }, async page => {
      await page.click(createWrapper().find('[data-testid="focus-before"]').toSelector());

      await page.keys(['Tab']);
      await expect(page.isFocused(likeButton.toSelector())).resolves.toBe(true);

      await page.keys(['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight']);
      await expect(page.isFocused(actionsMenu.find('button').toSelector())).resolves.toBe(true);

      await page.keys(['Enter']);
      await expect(page.getFocusedElementText()).resolves.toBe('Cut');

      await page.keys(['ArrowLeft']);
      await expect(page.getFocusedElementText()).resolves.toBe('Cut');

      await page.keys(['Enter']);
      await expect(page.isFocused(actionsMenu.find('button').toSelector())).resolves.toBe(true);

      await page.keys(['Enter']);
      await expect(page.getFocusedElementText()).resolves.toBe('Cut');

      await page.keys(['Escape']);
      await expect(page.isFocused(actionsMenu.find('button').toSelector())).resolves.toBe(true);
    })();
  }
);

test(
  'shows tooltip when a button is focused',
  setup({}, async page => {
    await page.click(likeButton.toSelector());
    await expect(page.getText(buttonGroup.findTooltip().toSelector())).resolves.toBe('Liked');

    await page.click(createWrapper().find('[data-testid="focus-on-copy"]').toSelector());
    await expect(page.isFocused(copyButton.toSelector())).resolves.toBe(true);

    await page.keys(['Tab', 'Enter']);
    await expect(page.isFocused(copyButton.toSelector())).resolves.toBe(true);
    await expect(page.getText(buttonGroup.findTooltip().toSelector())).resolves.toBe('Copy');
  })
);

test(
  'hides popover after clicking outside',
  setup({}, async page => {
    await page.click(likeButton.toSelector());
    await expect(page.getText(buttonGroup.findTooltip().toSelector())).resolves.toBe('Liked');

    await page.click(createWrapper().find('#last-clicked').toSelector());
    await expect(page.isExisting(buttonGroup.findTooltip().toSelector())).resolves.toBe(false);

    await page.click(actionsMenu.toSelector());
    await page.click(actionsMenu.findItemById('cut').toSelector());
    await page.click(createWrapper().find('#last-clicked').toSelector());
    await expect(page.isExisting(buttonGroup.findTooltip().toSelector())).resolves.toBe(false);
  })
);

test(
  'keeps focus in button group when action gets removed',
  setup({}, async page => {
    await page.click(dislikeButton.toSelector());
    await expect(page.isFocused(copyButton.toSelector())).resolves.toBe(true);
  })
);

test(
  'shows one tooltip at a time',
  setup({}, async page => {
    await page.click(createWrapper().find('[data-testid="focus-before"]').toSelector());

    await page.keys(['Tab']);
    await expect(page.isFocused(likeButton.toSelector())).resolves.toBe(true);

    await page.keys(['ArrowRight', 'ArrowRight']);
    await expect(page.isFocused(copyButton.toSelector())).resolves.toBe(true);
    await expect(page.getElementsCount(buttonGroup.findTooltip().toSelector())).resolves.toBe(1);
    await expect(page.getText(buttonGroup.findTooltip().toSelector())).resolves.toBe('Copy');

    await page.keys(['Enter']);
    await expect(page.getElementsCount(buttonGroup.findTooltip().toSelector())).resolves.toBe(1);
    await expect(page.getText(buttonGroup.findTooltip().toSelector())).resolves.toBe('Copied');

    await page.keys(['ArrowRight']);
    await expect(page.getElementsCount(buttonGroup.findTooltip().toSelector())).resolves.toBe(1);
    await expect(page.getText(buttonGroup.findTooltip().toSelector())).resolves.toBe('Send');

    await page.keys(['ArrowRight', 'ArrowRight', 'ArrowRight']);
    await expect(page.getElementsCount(buttonGroup.findTooltip().toSelector())).resolves.toBe(1);
    await expect(page.getText(buttonGroup.findTooltip().toSelector())).resolves.toBe('More actions');
  })
);

test(
  'keeps showing tooltip after clicking on a button with no popover feedback',
  setup({}, async page => {
    await page.hoverElement(sendButton.toSelector());
    await expect(page.getText(buttonGroup.findTooltip().toSelector())).resolves.toBe('Send');

    await page.click(sendButton.toSelector());
    await expect(page.getText(buttonGroup.findTooltip().toSelector())).resolves.toBe('Send');
  })
);

test(
  'shows tooltip over a menu after a menu item is clicked',
  setup({}, async page => {
    await page.click(actionsMenu.toSelector());
    await expect(page.isExisting(actionsMenu.findOpenDropdown().toSelector())).resolves.toBe(true);
    await expect(page.isExisting(buttonGroup.findTooltip().toSelector())).resolves.toBe(false);

    // No tooltip is shown after menu closes.
    await page.click(actionsMenu.findItemById('edit').toSelector());
    await expect(page.isExisting(actionsMenu.findOpenDropdown().toSelector())).resolves.toBe(false);
    await expect(page.isExisting(buttonGroup.findTooltip().toSelector())).resolves.toBe(false);

    // The tooltip is shown when the menu trigger is hovered.
    await page.hoverElement(actionsMenu.toSelector());
    await expect(page.getText(buttonGroup.findTooltip().toSelector())).resolves.toBe('More actions');
  })
);

test(
  'shows tooltip over a menu after a menu item is pressed',
  setup({}, async page => {
    await page.click(actionsMenu.toSelector());
    await expect(page.isExisting(actionsMenu.findOpenDropdown().toSelector())).resolves.toBe(true);
    await expect(page.isExisting(buttonGroup.findTooltip().toSelector())).resolves.toBe(false);

    // No tooltip is shown after menu closes with item selection.
    await page.click(actionsMenu.findItemById('edit').toSelector());
    await page.keys(['ArrowDown', 'ArrowDown', 'Enter']);
    await expect(page.isExisting(buttonGroup.findTooltip().toSelector())).resolves.toBe(false);

    // No tooltip is shown after menu closes with Escape.
    await page.click(actionsMenu.toSelector());
    await page.keys(['Escape']);
    await expect(page.isExisting(buttonGroup.findTooltip().toSelector())).resolves.toBe(false);

    // The tooltip is shown when the menu trigger is refocused.
    await page.keys(['ArrowLeft', 'ArrowRight']);
    await expect(page.getText(buttonGroup.findTooltip().toSelector())).resolves.toBe('More actions');
  })
);

test(
  'hides tooltip when focus moves to the next component from menu dropdown',
  setup({}, async page => {
    await page.click(actionsMenu.toSelector());
    await expect(page.isExisting(actionsMenu.findOpenDropdown().toSelector())).resolves.toBe(true);

    await page.keys(['ArrowDown', 'ArrowDown']);
    await expect(page.getFocusedElementText()).resolves.toBe('Edit');

    await page.keys(['Tab']);
    await expect(page.getFocusedElementText()).resolves.toBe('Focus on copy');
    await expect(page.isExisting(buttonGroup.findTooltip().toSelector())).resolves.toBe(false);
  })
);
