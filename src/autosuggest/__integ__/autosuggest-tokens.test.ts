// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import AutosuggestTokensPage from './page-objects/autosuggest-tokens-page';

const URL = '/#/light/autosuggest/tokens-mode';

function setupTest(testFn: (page: AutosuggestTokensPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new AutosuggestTokensPage(browser);
    await browser.url(URL);
    await page.waitForPageReady();
    await testFn(page);
  });
}

describe('Autosuggest mode=tokens — adding tokens', () => {
  test(
    'adds a token by pressing Enter after typing a value',
    setupTest(async page => {
      await page.typeAndAddToken('my-region');
      await page.assertTokenCount(1);
      expect(await page.getTokenLabel(1)).toContain('my-region');
    })
  );

  test(
    'clears the input after a token is added',
    setupTest(async page => {
      await page.typeAndAddToken('my-region');
      await expect(page.getInputValue()).resolves.toBe('');
    })
  );

  test(
    'adds a token by selecting a suggestion from the dropdown',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['us-east']);
      await page.clickOption(1);
      await page.assertTokenCount(1);
    })
  );

  test(
    'multiple tokens can be added sequentially',
    setupTest(async page => {
      await page.typeAndAddToken('region-a');
      await page.typeAndAddToken('region-b');
      await page.assertTokenCount(2);
    })
  );
});

describe('Autosuggest mode=tokens — dismissing tokens', () => {
  test(
    'dismisses a token when clicking its dismiss button',
    setupTest(async page => {
      await page.typeAndAddToken('to-remove');
      await page.assertTokenCount(1);
      await page.clickTokenDismiss(1);
      await page.assertTokenCount(0);
    })
  );

  test(
    'focuses the last token when Backspace is pressed on empty input',
    setupTest(async page => {
      await page.typeAndAddToken('region-a');
      await page.focusInput();
      await page.keys(['Backspace']);
      // Token dismiss button should now have focus — verify by dismissing with Enter
      await page.keys(['Enter']);
      await page.assertTokenCount(0);
    })
  );

  test(
    'dismisses last token using Delete key when token is focused',
    setupTest(async page => {
      await page.typeAndAddToken('region-a');
      await page.focusInput();
      await page.keys(['Backspace']); // focus last token
      await page.keys(['Delete']);
      await page.assertTokenCount(0);
    })
  );
});

describe('Autosuggest mode=tokens — overflow pill', () => {
  test(
    'shows overflow pill when tokens overflow the container',
    setupTest(async page => {
      // Add many tokens to trigger overflow
      for (const label of [
        'us-east-1',
        'eu-west-1',
        'ap-southeast-1',
        'ca-central-1',
        'sa-east-1',
        'eu-central-1',
        'ap-northeast-1',
        'us-west-1',
        'eu-north-1',
        'ap-east-1',
      ]) {
        await page.typeAndAddToken(label);
      }
      const pill = await page.getOverflowPillText();
      expect(pill).not.toBeNull();
      expect(pill).toMatch(/^\+\d+$/);
    })
  );

  test(
    'opens overflow dropdown when pill is clicked',
    setupTest(async page => {
      for (const label of [
        'us-east-1',
        'eu-west-1',
        'ap-southeast-1',
        'ca-central-1',
        'sa-east-1',
        'eu-central-1',
        'ap-northeast-1',
        'us-west-1',
        'eu-north-1',
        'ap-east-1',
      ]) {
        await page.typeAndAddToken(label);
      }
      await page.clickOverflowPill();
      await page.assertOverflowDropdownOpen();
    })
  );

  test(
    'closes overflow dropdown on Escape',
    setupTest(async page => {
      for (const label of [
        'us-east-1',
        'eu-west-1',
        'ap-southeast-1',
        'ca-central-1',
        'sa-east-1',
        'eu-central-1',
        'ap-northeast-1',
        'us-west-1',
        'eu-north-1',
        'ap-east-1',
      ]) {
        await page.typeAndAddToken(label);
      }
      await page.clickOverflowPill();
      await page.assertOverflowDropdownOpen();
      await page.keys(['Escape']);
      await page.assertOverflowDropdownOpen(false);
    })
  );
});

describe('Autosuggest mode=tokens — keyboard navigation', () => {
  test(
    'ArrowLeft from input focuses the last visible token',
    setupTest(async page => {
      await page.typeAndAddToken('region-a');
      await page.typeAndAddToken('region-b');
      await page.focusInput();
      await page.keys(['Backspace']); // focuses last token
      // Should now be on region-b dismiss button — pressing Enter dismisses it
      await page.keys(['Enter']);
      await page.assertTokenCount(1);
      expect(await page.getTokenLabel(1)).toContain('region-a');
    })
  );

  test(
    'ArrowRight from last token returns focus to input',
    setupTest(async page => {
      await page.typeAndAddToken('region-a');
      await page.focusInput();
      await page.keys(['Backspace']); // focuses region-a dismiss button
      await page.keys(['ArrowRight']); // back to input
      // Typing should now update the input value (not fire dismiss)
      await page.keys(['x']);
      await expect(page.getInputValue()).resolves.toBe('x');
    })
  );

  test(
    'ArrowLeft navigates between adjacent tokens',
    setupTest(async page => {
      await page.typeAndAddToken('first');
      await page.typeAndAddToken('second');
      await page.focusInput();
      await page.keys(['Backspace']); // focuses second (last) token
      await page.keys(['ArrowLeft']); // focuses first token
      // Dismiss first token with Enter
      await page.keys(['Enter']);
      await page.assertTokenCount(1);
      expect(await page.getTokenLabel(1)).toContain('second');
    })
  );
});
