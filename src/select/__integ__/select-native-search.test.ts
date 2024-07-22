// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import SelectPageObject from './page-objects/select-page';

describe(`Select (Native Search)`, () => {
  const setupTest = (selectorType: string, testFn: (page: SelectPageObject) => Promise<void>) => {
    return useBrowser(async browser => {
      const wrapper = createWrapper().findSelect(`#select_native_search_${selectorType}`);
      await browser.url('/#/light/select/select.test');
      const page = new SelectPageObject(browser, wrapper);
      await page.waitForVisible(wrapper.findTrigger().toSelector());
      await testFn(page);
    });
  };

  describe('Options - Simple', () => {
    const optionsType = 'simple';

    test(
      'highlights the first match on search on single keypress with dropdown open',
      setupTest(optionsType, async page => {
        await page.clickSelect();
        await page.keys(['o']);
        await expect(page.getHighlightedOptionLabel()).resolves.toBe('Option 1');
      })
    );

    test(
      'highlights the second match on search on double keypress with dropdown open',
      setupTest(optionsType, async page => {
        await page.clickSelect();
        await page.keys(['o', 'o']);
        await expect(page.getHighlightedOptionLabel()).resolves.toBe('Option 2');
      })
    );

    test(
      'highlights the first match on search on triple (length of matches + 1) keypress with dropdown open',
      setupTest(optionsType, async page => {
        await page.clickSelect();
        await page.keys(['o', 'o', 'o']);
        await expect(page.getHighlightedOptionLabel()).resolves.toBe('Option 1');
      })
    );

    test(
      'selects the first match on search on single keypress with dropdown closed',
      setupTest(optionsType, async page => {
        await page.focusSelect();
        await page.keys(['o']);
        await expect(page.getTriggerLabel()).resolves.toMatch('Option 1');
      })
    );

    test(
      'selects the second match on search on double keypress with dropdown closed',
      setupTest(optionsType, async page => {
        await page.focusSelect();
        await page.keys(['o', 'o']);
        await expect(page.getTriggerLabel()).resolves.toMatch('Option 2');
      })
    );

    test(
      'selects the first match on search on triple (length of matches + 1) keypress with dropdown closed',
      setupTest(optionsType, async page => {
        await page.focusSelect();
        await page.keys(['o', 'o', 'o']);
        await expect(page.getTriggerLabel()).resolves.toMatch('Option 1');
      })
    );

    test(
      'no match - no highlight, with dropdown open',
      setupTest(optionsType, async page => {
        await page.clickSelect();
        await page.keys(['a']);
        await page.assertHighlightedOption(false);
      })
    );

    test(
      'no match - no selection, with dropdown closed',
      setupTest(optionsType, async page => {
        await page.focusSelect();
        await page.keys(['a']);
        await expect(page.getTriggerLabel()).resolves.toEqual('Choose option');
      })
    );
  });

  describe('Options - Extended', () => {
    const optionsType = 'extended';

    test(
      'highlights the match with dropdown open -- extended option, searches entire option',
      setupTest(optionsType, async page => {
        await page.clickSelect();
        await page.keys(['s', 's']);
        await expect(page.getHighlightedOptionLabel()).resolves.toBe('Third thing');
      })
    );

    test(
      'selects the match with dropdown closed -- extended option, searches entire option',
      setupTest(optionsType, async page => {
        await page.focusSelect();
        await page.keys(['s', 's']);
        await expect(page.getTriggerLabel()).resolves.toMatch('Third thing');
      })
    );

    test(
      'no highlight when the option does not start with the search substring',
      setupTest(optionsType, async page => {
        await page.clickSelect();
        await page.keys(['a']);
        await page.assertHighlightedOption(false);
      })
    );
  });

  describe('Options - Semi-extended', () => {
    const optionsType = 'semi_extended';

    test(
      'highlights the match with dropdown open -- extended option with missing properties, searches entire option',
      setupTest(optionsType, async page => {
        await page.clickSelect();
        await page.keys(['a', 'n', 'o']);
        await expect(page.getHighlightedOptionLabel()).resolves.toBe('Another thing');
      })
    );

    test(
      'selects the match with dropdown closed -- extended option with missing properties, searches entire option',
      setupTest(optionsType, async page => {
        await page.focusSelect();
        await page.keys(['a', 'n', 'o']);
        await expect(page.getTriggerLabel()).resolves.toMatch('Another thing');
      })
    );

    test(
      'highlights the match with dropdown open -- multi character search',
      setupTest(optionsType, async page => {
        await page.clickSelect();
        await page.keys(['t', 'h', 'i', 'r', 'd']);
        await expect(page.getHighlightedOptionLabel()).resolves.toBe('Third thing');
      })
    );

    test(
      'selects the match with dropdown closed -- extended option with missing properties, searches entire option',
      setupTest(optionsType, async page => {
        await page.focusSelect();
        await page.keys(['t', 'h', 'i', 'r', 'd']);
        await expect(page.getTriggerLabel()).resolves.toMatch('Third thing');
      })
    );
  });
});
