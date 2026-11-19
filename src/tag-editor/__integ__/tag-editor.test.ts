// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import TagEditorPage from './page/tag-editor-page';

const tagEditorWrapper = createWrapper().findTagEditor();

const setupTest = (testFn: (page: TagEditorPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new TagEditorPage(browser);
    await browser.url('#/light/tag-editor/integ');
    await page.waitForVisible(tagEditorWrapper.findAddButton().toSelector());
    await testFn(page);
  });
};

describe('Tag Editor', () => {
  const initialTags = [
    { key: 'key-1', markedForRemoval: false, value: 'value-1' },
    { key: 'key-2', markedForRemoval: true },
    { key: '', markedForRemoval: false, value: '' },
    { key: 'key-3', markedForRemoval: false, value: '' },
  ];

  describe('Validation', () => {
    test(
      'should handle empty key validation',
      setupTest(async page => {
        // does not validate for empty keys if this is the initial visit
        await page.focusKey(3);
        await expect(page.hasKeyError(3)).resolves.toBe(false);

        // Sets error on blur
        await page.keys('Tab');
        await expect(page.getKeyError(3)).resolves.toBe('You must specify a tag key');

        // Clears error when a value is set
        await page.focusKey(3);
        await page.keys('a');
        await expect(page.hasKeyError(3)).resolves.toBe(false);
      })
    );
  });

  describe('Business cases', () => {
    test(
      'standard tag editor usage',
      setupTest(async page => {
        // This tests a standard expected usage of the component where a customer will
        // 1. Load initial tags
        // 2. Add a new tag
        // 3. Change key to match another row to trigger validation
        // 4. Remove existing then add a new with the same Key
        // 5. Add another new tag then delete it

        // 2. Add a new tag
        await page.addTag();
        await page.searchKey('key-5', 5);

        // 3. Change key to match another row to trigger validation
        await page.searchKey('key-5', 3);
        await expect(page.isKeyLoading(3)).resolves.toBe(true);
        const resolvedRequests = await page.resolveKeys(['key-5']);
        expect(resolvedRequests).toBeGreaterThan(0);
        await expect(page.isKeyLoading(3)).resolves.toBe(false);

        await page.selectKeyFromDropdown(3, 1);

        const expectedError = 'You must specify a unique tag key.';
        await expect(page.getKeyError(3)).resolves.toBe(expectedError);
        await expect(page.getKeyError(5)).resolves.toBe(expectedError);

        // 4. Remove existing then add a new with the same Key
        await page.removeTag(1);
        await page.addTag();
        await page.searchKey('key-1', 6);

        await expect(page.hasKeyError(6)).resolves.toBe(false);
      })
    );
  });

  describe('Edge cases', () => {
    // Regression test for AWSUI-11804
    test(
      'can activate remove and undo buttons with enter key',
      setupTest(async page => {
        // Place focus on the remove button, and press enter
        await page.focusKey(1);
        await page.keys(['Tab', 'Tab', 'Tab', 'Enter']);

        // The focus should not switch back to the remove button.
        await expect(page.isUndoFocussed(1)).resolves.toBe(true);
      })
    );

    test(
      'multiple interactions on the same tag',
      setupTest(async page => {
        // This tests repeated operations on the same tag to ensure component state is rendered correctly and that previous operations do not cause side effects
        // that could prevent you from repeating this operation
        // 1. Load initial tags
        // 2. Add new tag -> Remove added tag -> Add new tag
        // 3. Remove existing tag -> Undo remove -> Remove existing tag -> Undo remove

        // 2. Add new tag -> Remove added tag -> Add new tag
        await page.addTag();
        await page.removeTag(5);
        page.focusTagEditor();
        await page.addTag();

        // 3. Remove existing tag -> Undo remove -> Remove existing tag
        await page.removeTag(1);
        await page.undoTagRemoval(1);
        await page.removeTag(1);
        await page.undoTagRemoval(1);

        const expectedTags = [...initialTags, { key: '', markedForRemoval: false, value: '' }];
        await expect(page.getTags()).resolves.toEqual(expectedTags);
      })
    );

    test(
      'headers are re-rendered when locale is changed',
      setupTest(async page => {
        await expect(page.getRowHeaders(1)).resolves.toEqual(['Key', 'Value - optional']);
        await page.changeLocale('de');
        await expect(page.getRowHeaders(1)).resolves.toEqual(['Key2', 'Value2 - optional']);
      })
    );

    test(
      'component renders the correct suggestion i18nStrings when locale is changed',
      setupTest(async page => {
        await page.searchKey('test', 3);
        await expect(page.isKeyLoading(3)).resolves.toBe(true);
        await expect(page.getKeyLoadingText(3)).resolves.toBe('Loading key values');
        const resolvedKeys = await page.resolveKeys(['key-5']);
        expect(resolvedKeys).toBeGreaterThan(0);
        await expect(page.isKeyLoading(3)).resolves.toBe(false);

        await page.searchValue('test', 3);
        await expect(page.isValueLoading(3)).resolves.toBe(true);
        await expect(page.getValueLoadingText(3)).resolves.toBe('Loading tag values');
        const resolvedValues = await page.resolveValues(['value-1']);
        expect(resolvedValues).toBeGreaterThan(0);
        await expect(page.isValueLoading(3)).resolves.toBe(false);

        await page.changeLocale('de');

        await page.searchKey('test2', 3);
        await expect(page.isKeyLoading(3)).resolves.toBe(true);
        await expect(page.getKeyLoadingText(3)).resolves.toBe('Loading key values2');

        await page.searchValue('test2', 3);
        await expect(page.isValueLoading(3)).resolves.toBe(true);
        await expect(page.getValueLoadingText(3)).resolves.toBe('Loading tag values2');
      })
    );
  });
});
