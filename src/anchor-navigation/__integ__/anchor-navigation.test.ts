// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
//import * as React from 'react';
//import { AnchorNavigationWrapper } from '../../../lib/components/test-utils/dom';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { createWrapper } from '@cloudscape-design/test-utils-core/dom';

class AnchorNavigationPage extends BasePageObject {
  getAriaLabelledby(): string | null {
    const element = createWrapper().findAnchorNavigation();
    return element!.getElement().getAttribute('aria-labelledby');
  }
}

const setupTest = (testFn: (page: AnchorNavigationPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new AnchorNavigationPage(browser);
    await browser.url(`#/light/anchor-navigation/basic`);
    await testFn(page);
  });
};

describe('AnchorNavigation', () => {
  it('the first anchor is active', () => {
    setupTest(async page => {
      console.log('here!!!!', page);
      await expect(createWrapper().findAnchorNavigation()).toBeTruthy();
    });
  });

  // it('the correct aria-labelledby attribute is applied', () => {});

  // it('scrolling to a section makes it active', () => {});

  // it('scrolling to the end of the page, makes the last section active', () => {});

  // it('scrolling to a section below the scrollSpyOffset makes the section active', () => {});

  // it('scrolling to a section above the scrollSpyOffset does not make the section active', () => {});

  // it('onActiveHrefChange is only called once', () => {});

  // it('onFollow is only called when clicking a section', () => {});
});
