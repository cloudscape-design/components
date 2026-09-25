// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const pagePath = 'onboarding/with-app-layout';
const pageHeight = 800; // Just enough vertical space to capture the tutorial panel

const suite: TestSuite = {
  description: 'Tutorial components',
  componentName: 'tutorial-components',
  tests: [
    {
      description: 'before starting a tutorial',
      path: pagePath,
      screenshotType: 'screenshotArea',
      configuration: { height: pageHeight },
    },
    {
      description: 'after starting a tutorial',
      path: pagePath,
      screenshotType: 'screenshotArea',
      configuration: { height: pageHeight },
      setup: async ({ page, wrapper }) => {
        const startTutorialButton = wrapper
          .findAppLayout()
          .findTools()
          .findTutorialPanel()
          .findTutorials()
          .get(1)
          .findStartButton()
          .toSelector();
        const nextAnnotationButton = wrapper.findHotspot().findAnnotation().findNextButton().toSelector();

        // Start the first tutorial.
        // This will show tutorial steps in the tutorial panel and hotspot annotations in the page.
        await page.click(startTutorialButton);

        // Advance to the fourth annotation, which features an alert inside and therefore gives us a bit more coverage.
        // Also, the first two annotations overflow the app layout and therefore would be cropped.
        await page.click(nextAnnotationButton);
        await page.click(nextAnnotationButton);
        await page.click(nextAnnotationButton);
      },
    },
    {
      description: 'tutorial inside flashbar',
      path: 'annotation-context/with-flashbar',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findHotspot().findAnnotation().findDismissButton().toSelector());
        await page.waitForExist(wrapper.findHotspot().findAnnotation().toSelector(), false);
      },
    },
  ],
};

export default suite;
