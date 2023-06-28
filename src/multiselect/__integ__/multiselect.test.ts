// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper, { MultiselectWrapper } from '../../../lib/components/test-utils/selectors';
import MultiselectPageObject from './page-objects/multiselect-page';

const createSetupTest = (wrapper: MultiselectWrapper) => (testFn: (page: MultiselectPageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new MultiselectPageObject(browser, wrapper);
    await browser.url('/#/light/multiselect/multiselect.test');
    await page.setWindowSize({ width: 400, height: 1200 });
    await page.waitForVisible(wrapper.findTrigger().toSelector());
    await testFn(page);
  });
};

[false, true].forEach(keepOpen => {
  describe(`Multiselect with keepOpen=${keepOpen}`, () => {
    const wrapper = createWrapper().findMultiselect(keepOpen ? '#keep_open' : '#close_after');
    const setupTest = createSetupTest(wrapper);

    test(
      'opens with selected options',
      setupTest(async page => {
        await page.clickSelect();
        await page.assertDropdownOpen(true);
        await expect(page.getSelectedOptionLabels()).resolves.toEqual(['option3', 'option4']);
        await expect(page.getTokenLabels()).resolves.toEqual(['option3', 'option4']);
      })
    );

    test(
      'selects options correctly',
      setupTest(async page => {
        await page.clickSelect();
        await page.clickOptionInGroup(1, 1);
        await page.assertDropdownOpen(keepOpen);
        await page.ensureDropdownOpen();

        await expect(page.getSelectedOptionLabels()).resolves.toEqual(['option1', 'option3', 'option4']);
        await expect(page.getTokenLabels()).resolves.toEqual(['option3', 'option4', 'option1']);
      })
    );

    test(
      'deselects options correctly',
      setupTest(async page => {
        await page.clickSelect();
        await page.clickOptionInGroup(1, 3);
        await page.assertDropdownOpen(keepOpen);
        await page.ensureDropdownOpen();

        await expect(page.getSelectedOptionLabels()).resolves.toEqual(['option4']);
        await expect(page.getTokenLabels()).resolves.toEqual(['option4']);
      })
    );

    test(
      'allows to deselect options by clicking on the close icon on tokens',
      setupTest(async page => {
        await page.clickTokenDismiss(1);
        await page.ensureDropdownOpen();

        await expect(page.getSelectedOptionLabels()).resolves.toEqual(['option4']);
        await expect(page.getTokenLabels()).resolves.toEqual(['option4']);
      })
    );

    test(
      'highlights the first match on search on single keypress with dropdown open',
      setupTest(async page => {
        await page.clickSelect();
        await page.keys(['o']);

        await expect(page.getHighlightedOptionLabel()).resolves.toBe('First category');
      })
    );

    test(
      'highlights the second enabled match on search on double keypress with dropdown open',
      setupTest(async page => {
        await page.clickSelect();
        await page.keys(['o', 'o']);

        await expect(page.getHighlightedOptionLabel()).resolves.toBe('option1');
      })
    );

    test(
      'highlights the first match on search on triple (length of matches + 1) keypress with dropdown open',
      setupTest(async page => {
        await page.clickSelect();
        await page.keys(['o', 'o', 'o', 'o', 'o', 'o', 'o']);

        await expect(page.getHighlightedOptionLabel()).resolves.toBe('First category');
      })
    );

    test(
      'does not select the matching option with dropdown closed',
      setupTest(async page => {
        await page.focusSelect();
        await page.keys(['o', 'o']);
        await expect(page.getTokenLabels()).resolves.toEqual(['option3', 'option4']);
      })
    );
  });
});

describe('focus handling', () => {
  test('focuses trigger after dismissing all tokens', () => {
    const wrapper = createWrapper().findMultiselect('#keep_open');
    const setupTest = createSetupTest(wrapper);

    return setupTest(async page => {
      // Focus dismiss button on 2nd tab
      await page.focusSelect();
      await page.keys(['Tab', 'Tab']);
      await expect(page.isFocused(wrapper.findToken(2).findDismiss().toSelector())).resolves.toBe(true);
      await page.keys(['Enter']);
      await expect(page.isFocused(wrapper.findToken(1).findDismiss().toSelector())).resolves.toBe(true);
      await page.keys(['Enter']);
      await expect(page.isFocused(wrapper.findTrigger().toSelector())).resolves.toBe(true);
    })();
  });

  test('should allow selecting text in the filtering input', () => {
    const wrapper = createWrapper().findMultiselect('#with_filtering');
    const setupTest = createSetupTest(wrapper);

    return setupTest(async page => {
      await page.clickSelect();
      await page.click(wrapper.findFilteringInput().toSelector());
      await page.keys('selectme');
      await page.doubleClick(wrapper.findFilteringInput().toSelector());
      await expect(page.getSelectedText()).resolves.toEqual('selectme');
    })();
  });

  test('should move focus back to the trigger if expandToViewport=true', () => {
    const wrapper = createWrapper().findMultiselect('#expand_to_viewport');
    const setupTest = createSetupTest(wrapper);

    return setupTest(async page => {
      await page.clickSelect();
      await page.keys(['Tab']);
      await page.waitForVisible(wrapper.findDropdown({ expandToViewport: true }).toSelector(), false);
      await expect(page.isFocused(wrapper.findTrigger().toSelector())).resolves.toBe(true);
    })();
  });
});

describe(`Multiselect with filtering`, () => {
  const wrapper = createWrapper().findMultiselect('#with_filtering');
  const setupTest = createSetupTest(wrapper);

  test(
    'keeps filtering state after selecting an option',
    setupTest(async page => {
      await page.clickSelect();
      await page.keys(['t', 'i', 'o', 'n', '3']);
      await expect(page.getDropdownOptionCount()).resolves.toBe(1);
      await page.clickOption(1);
      await expect(page.getDropdownOptionCount()).resolves.toBe(1);
    })
  );

  test(
    'keeps filtering state after selecting an option using keyboard',
    setupTest(async page => {
      await page.clickSelect();
      await page.keys(['t', 'i', 'o', 'n', '3']);
      await page.keys(['ArrowDown']);

      await expect(page.getDropdownOptionCount()).resolves.toBe(1);
      await page.keys(['Enter']);
      await expect(page.getDropdownOptionCount()).resolves.toBe(1);
    })
  );

  test(
    'input aria-activedescendant is same as highlighted option id',
    setupTest(async page => {
      await page.focusSelect();
      await page.keys(['ArrowDown']);
      const highlightedOptionId = await page.getElementProperty(
        wrapper.findDropdown()!.findHighlightedOption()!.toSelector(),
        'id'
      );
      const activedescendant = await page.getElementAttribute(
        wrapper.findFilteringInput().findNativeInput().toSelector(),
        'aria-activedescendant'
      );
      await expect(highlightedOptionId).toEqual(activedescendant);
    })
  );
});

describe('Multiselect with token limit', () => {
  const wrapper = createWrapper().findMultiselect('#with_token_limit');
  const setupTest = createSetupTest(wrapper);

  test(
    'expands and collapses by clicking',
    setupTest(async page => {
      await page.clickTokenToggle();
      await expect(page.getTokenLabels()).resolves.toEqual(['option3', 'option4']);

      await page.clickTokenToggle();
      await expect(page.getTokenLabels()).resolves.toEqual(['option3']);
    })
  );

  ['Space', 'Enter'].forEach(key => {
    test(
      `expands and collapses by pressing the ${key} key`,
      setupTest(async page => {
        await page.pressTokenToggle(key);
        await expect(page.getTokenLabels()).resolves.toEqual(['option3', 'option4']);

        await page.pressTokenToggle(key);
        await expect(page.getTokenLabels()).resolves.toEqual(['option3']);
      })
    );
  });
});

describe(`Multiselect with group selection`, () => {
  const wrapper = createWrapper().findMultiselect('#group_selection');
  const setupTest = createSetupTest(wrapper);

  test(
    'group selection selects all enabled child options',
    setupTest(async page => {
      await page.clickSelect();
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['Enter']);
      await expect(page.getSelectedOptionLabels()).resolves.toEqual([
        'Second category',
        'option4',
        'option5',
        'option6',
      ]);
      await expect(page.getTokenLabels()).resolves.toEqual(['option5', 'option4', 'option6']);
    })
  );
  test(
    'group selection deselects all enabled child options on double press',
    setupTest(async page => {
      await page.clickSelect();
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['Enter']);
      await page.keys(['Enter']);

      await expect(page.getSelectedOptionLabels()).resolves.toEqual(['option5']);
      await expect(page.getTokenLabels()).resolves.toEqual(['option5']);
    })
  );
  test(
    'deselecting an element removes the parent from the selected options labels',
    setupTest(async page => {
      await page.clickSelect();
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['Enter']);
      await page.keys(['ArrowDown']);
      await page.keys(['Enter']);
      await expect(page.getSelectedOptionLabels()).resolves.toEqual(['option5', 'option6']);
      await expect(page.getTokenLabels()).resolves.toEqual(['option5', 'option6']);
    })
  );
  test(
    'selecting elements one by one selects the parent',
    setupTest(async page => {
      await page.clickSelect();
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['Enter']);
      await expect(page.getSelectedOptionLabels()).resolves.toEqual([
        'Second category',
        'option4',
        'option5',
        'option6',
      ]);
      await expect(page.getTokenLabels()).resolves.toEqual(['option4', 'option5', 'option6']);
    })
  );

  test(
    'selection with filter only selects visible children',
    setupTest(async page => {
      await page.clickSelect();
      await page.keys(['3']);
      await page.keys(['ArrowDown']);
      await page.keys(['Enter']);
      await expect(page.getSelectedOptionLabels()).resolves.toEqual(['option3']);
      await expect(page.getTokenLabels()).resolves.toEqual(['option4', 'option5', 'option3']);
    })
  );
  test(
    'group deselection with filter only deselects visible children',
    setupTest(async page => {
      await page.clickSelect();
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['Enter']);
      await page.keys(['4']);
      await page.keys(['ArrowDown']);
      await page.keys(['ArrowDown']);
      await page.keys(['Enter']);
      await expect(page.getSelectedOptionLabels()).resolves.toEqual([]);
      await expect(page.getTokenLabels()).resolves.toEqual(['option5', 'option6']);
    })
  );
  test(
    'keeps filtering state after selecting a group option',
    setupTest(async page => {
      await page.clickSelect();
      await page.keys(['3']);
      await expect(page.getDropdownOptionCount()).resolves.toBe(1);
      await page.keys(['ArrowDown']);
      await page.keys(['Enter']);
      await expect(page.getDropdownOptionCount()).resolves.toBe(1);
    })
  );
});
