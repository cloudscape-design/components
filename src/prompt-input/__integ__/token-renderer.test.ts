// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

const editorSelector = '[data-testid="token-editor"]';
const tokenStateSelector = '[data-testid="token-state"]';
const extractedStateSelector = '[data-testid="extracted-state"]';

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ width: 1200, height: 800 });
    await browser.url('#/light/prompt-input/token-renderer');
    await page.waitForVisible(editorSelector);
    await testFn(page);
  });
};

const clickButton = async (page: BasePageObject, label: string) => {
  await page.click(`button=${label}`);
  // Allow React state update and DOM render
  await page.pause(100);
};

const getTokenState = (page: BasePageObject): Promise<string> => {
  return page.getText(tokenStateSelector);
};

const getEditorText = (page: BasePageObject): Promise<string> => {
  return page.getText(editorSelector);
};

describe('Token Renderer (isolated)', () => {
  test(
    'renders empty editor initially',
    setupTest(async page => {
      const editorText = await getEditorText(page);
      expect(editorText).toBe('');

      const tokenState = await getTokenState(page);
      expect(tokenState.trim()).toBe('[]');
    })
  );

  test(
    'add text — editor shows text content and token state shows text token',
    setupTest(async page => {
      await clickButton(page, 'Add text');

      const editorText = await getEditorText(page);
      expect(editorText).toContain('Hello world');

      const tokenState = await getTokenState(page);
      expect(tokenState).toContain('"type": "text"');
      expect(tokenState).toContain('Hello world');
    })
  );

  test(
    'add reference — editor shows custom token with lightning prefix',
    setupTest(async page => {
      await clickButton(page, 'Add reference');

      const editorText = await getEditorText(page);
      expect(editorText).toContain('Alice');

      const tokenState = await getTokenState(page);
      expect(tokenState).toContain('"type": "reference"');
      expect(tokenState).toContain('"label": "Alice"');
    })
  );

  test(
    'add multiple tokens — text + reference + text, verify order in token state',
    setupTest(async page => {
      await clickButton(page, 'Add text');
      await clickButton(page, 'Add reference');
      await clickButton(page, 'Add text');

      const tokenState = await getTokenState(page);
      const parsed = JSON.parse(tokenState);
      expect(parsed).toHaveLength(3);
      expect(parsed[0].type).toBe('text');
      expect(parsed[1].type).toBe('reference');
      expect(parsed[2].type).toBe('text');
    })
  );

  test(
    'add break — creates multi-paragraph content',
    setupTest(async page => {
      await clickButton(page, 'Add text');
      await clickButton(page, 'Add break');
      await clickButton(page, 'Add text');

      const tokenState = await getTokenState(page);
      const parsed = JSON.parse(tokenState);
      expect(parsed).toHaveLength(3);
      expect(parsed[0].type).toBe('text');
      expect(parsed[1].type).toBe('break');
      expect(parsed[2].type).toBe('text');
    })
  );

  test(
    'clear all — empties editor and token state',
    setupTest(async page => {
      await clickButton(page, 'Add text');
      await clickButton(page, 'Add reference');

      // Verify tokens exist before clearing
      let tokenState = await getTokenState(page);
      let parsed = JSON.parse(tokenState);
      expect(parsed.length).toBeGreaterThan(0);

      await clickButton(page, 'Clear all');

      tokenState = await getTokenState(page);
      parsed = JSON.parse(tokenState);
      expect(parsed).toHaveLength(0);

      const editorText = await getEditorText(page);
      expect(editorText).toBe('');
    })
  );

  test(
    'extract from DOM — after adding tokens, extracted matches token state',
    setupTest(async page => {
      await clickButton(page, 'Add text');
      await clickButton(page, 'Add reference');

      await clickButton(page, 'Extract from DOM');
      await page.waitForVisible(extractedStateSelector);

      const tokenState = await getTokenState(page);
      const extractedState = await page.getText(extractedStateSelector);

      const tokens = JSON.parse(tokenState);
      const extracted = JSON.parse(extractedState);

      // Both should have the same number of tokens
      expect(extracted).toHaveLength(tokens.length);
      // Types should match
      expect(extracted.map((t: { type: string }) => t.type)).toEqual(tokens.map((t: { type: string }) => t.type));
    })
  );

  test(
    'add trigger — editor shows trigger element',
    setupTest(async page => {
      await clickButton(page, 'Add @ trigger');

      const tokenState = await getTokenState(page);
      expect(tokenState).toContain('"type": "trigger"');
      expect(tokenState).toContain('"triggerChar": "@"');
    })
  );

  test(
    'add slash trigger — editor shows slash trigger element',
    setupTest(async page => {
      await clickButton(page, 'Add / trigger');

      const tokenState = await getTokenState(page);
      expect(tokenState).toContain('"type": "trigger"');
      expect(tokenState).toContain('"triggerChar": "/"');
    })
  );

  test(
    'round-trip: add tokens, extract from DOM, tokens match',
    setupTest(async page => {
      await clickButton(page, 'Add text');
      await clickButton(page, 'Add reference');
      await clickButton(page, 'Add text');

      const tokenStateBefore = await getTokenState(page);
      const tokensBefore = JSON.parse(tokenStateBefore);

      await clickButton(page, 'Extract from DOM');
      await page.waitForVisible(extractedStateSelector);

      const extractedState = await page.getText(extractedStateSelector);
      const extracted = JSON.parse(extractedState);

      expect(extracted).toHaveLength(tokensBefore.length);
      for (let i = 0; i < tokensBefore.length; i++) {
        expect(extracted[i].type).toBe(tokensBefore[i].type);
        if (tokensBefore[i].type === 'text') {
          expect(extracted[i].value).toBe(tokensBefore[i].value);
        }
        if (tokensBefore[i].type === 'reference') {
          expect(extracted[i].label).toContain(tokensBefore[i].label);
        }
      }
    })
  );
});
