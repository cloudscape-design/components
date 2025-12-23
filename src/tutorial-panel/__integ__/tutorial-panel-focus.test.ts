// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

class TutorialPanelFocusPage extends BasePageObject {
  getTutorialPanel() {
    return createWrapper().findAppLayout().findTools().findTutorialPanel();
  }

  async startFirstTutorial() {
    const tutorialPanel = this.getTutorialPanel();
    await this.click(tutorialPanel.findTutorials().get(1).findStartButton().toSelector());
  }

  async exitTutorial() {
    const tutorialPanel = this.getTutorialPanel();
    await this.click(tutorialPanel.findDismissButton().toSelector());
  }

  getTutorialListHeader() {
    const tutorialPanel = this.getTutorialPanel();
    return tutorialPanel.find('[tabindex="-1"]').toSelector();
  }

  isTutorialListHeaderFocused() {
    const headerSelector = this.getTutorialListHeader();
    return this.isFocused(headerSelector);
  }

  async waitForTutorialListToLoad() {
    const tutorialPanel = this.getTutorialPanel();
    await this.waitForVisible(tutorialPanel.findTutorials().get(1).toSelector());
  }

  async waitForTutorialDetailToLoad() {
    const tutorialPanel = this.getTutorialPanel();
    await this.waitForVisible(tutorialPanel.findDismissButton().toSelector());
  }
}

const setupTest = (testFn: (page: TutorialPanelFocusPage) => Promise<void>) =>
  useBrowser(async browser => {
    const page = new TutorialPanelFocusPage(browser);
    await browser.url('#/light/onboarding/with-app-layout');
    await page.waitForTutorialListToLoad();
    await testFn(page);
  });

describe('TutorialPanel Focus Management', () => {
  test(
    'restores focus to panel header when exiting tutorial',
    setupTest(async page => {
      await page.startFirstTutorial();
      await page.waitForTutorialDetailToLoad();

      await page.exitTutorial();
      await page.waitForTutorialListToLoad();

      await expect(page.isTutorialListHeaderFocused()).resolves.toBe(true);
    })
  );
});
