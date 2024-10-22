// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import { ModalPerformanceDataProps } from '../../../lib/components/internal/analytics/interfaces';
import createWrapper from '../../../lib/components/test-utils/selectors';

test(
  'Should focus input after opening the modal',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/modal/with-input-focus');
    await page.click('#open-modal');
    const inputSelector = createWrapper().findInput('#input').findNativeInput().toSelector();

    await expect(page.isFocused(inputSelector)).resolves.toBe(true);
  })
);

test.each(['destructible', 'controlled'])(`should reset focus to previously active element (%s)`, name =>
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/modal/focus-restoration');
    await page.click(`#${name}`);
    await page.keys('Enter');
    await expect(page.isFocused(`#${name}`)).resolves.toBe(true);
  })()
);

test(
  'should not move focus to the modal close button when content focus gets lost',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/modal/focus-restoration');

    // Open modal
    await page.click('#destructible');

    // Select 5th "Remove" button
    await page.keys(['Tab', 'Tab', 'Tab']);
    await page.keys(['Tab', 'Tab', 'Tab']);
    await page.keys(['Tab', 'Tab', 'Tab']);
    await page.keys(['Tab', 'Tab', 'Tab']);
    await page.keys(['Tab', 'Tab', 'Tab']);
    await expect(page.getFocusedElementText()).resolves.toBe('Remove');

    // Remove attributes until focus moves away from the "Remove" button.
    do {
      await page.keys(['Enter']);
    } while ((await page.getFocusedElementText()) === 'Remove');

    // Expected the focus to go to the body but not the first focusable element of the modal.
    await expect(page.isFocused('body')).resolves.toBe(true);
  })
);

test(
  'should not let the sticky footer cover focused elements',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/modal/scroll-padding');

    // Open modal
    await page.click('[data-testid="modal-trigger"]');
    const modal = createWrapper().findModal();
    const modalContent = modal.findContent();
    const footerSelector = modal.findFooter().toSelector();
    for (let i = 0; i < 100; i++) {
      page.keys('Tab');
      const input = modalContent
        .findAll('div')
        .get(i + 1)
        .find('input');
      const inputSelector = input.toSelector();
      expect(await page.isFocused(inputSelector)).toBe(true);
      const inputBox = await page.getBoundingBox(inputSelector);
      const footerBox = await page.getBoundingBox(footerSelector);
      const inputCenter = inputBox.top + inputBox.height / 2;
      expect(inputCenter).toBeLessThan(footerBox.top);
    }
  })
);

test(
  'should not let content with z-index overlap footer',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/modal/vertical-scroll');

    // Open modal
    await page.click('[data-testid="modal-trigger"]');
    const modal = createWrapper().findModal();
    const footerSelector = modal.findFooter().toSelector();

    // this will throw an error if the footer is overlapped by the content
    await page.click(footerSelector);
  })
);

test(
  'renders modal in async root',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    const modal = createWrapper().findModal();
    await browser.url('#/light/modal/async-modal-root');

    // Open modal
    await page.click('[data-testid="modal-trigger"]');
    // wait for async modal to appear
    await page.waitForVisible(modal.toSelector());

    await expect(page.isExisting('#async-modal-root')).resolves.toBe(true);

    await page.click(modal.findDismissButton().toSelector());
    await expect(page.isExisting('#async-modal-root')).resolves.toBe(false);
  })
);

test(
  'should emit modal performance metrics when all components are loaded',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/modal/with-component-load');
    const getModalPerformanceMetrics = () =>
      browser.execute(() => ((window as any).modalPerformanceMetrics ?? []) as ModalPerformanceDataProps[]);
    await page.click('[data-testid="modal-trigger"]');
    let metrics = await getModalPerformanceMetrics();

    //verify metrics are not emitted until all the components are loaded
    expect(metrics.length).toBe(0);

    //set loading state to false
    const wrapper = createWrapper();
    const buttonLoadingCheckBox = wrapper.findCheckbox('#checkbox-button2').findLabel().toSelector();
    const textLoadingCheckBox = wrapper.findCheckbox('#checkbox-text2').findLabel().toSelector();
    await page.click(buttonLoadingCheckBox);
    await page.click(textLoadingCheckBox);

    metrics = await getModalPerformanceMetrics();
    expect(metrics[0].instanceIdentifier).not.toBeNull();
    expect(metrics[0].timeToContentReadyInModal).not.toBeNull();
  })
);

test(
  'should emit modal performance metrics with timeToContentReadyInModal 0 when components are already loaded',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/modal/with-component-load');
    const getModalPerformanceMetrics = () =>
      browser.execute(() => ((window as any).modalPerformanceMetrics ?? []) as ModalPerformanceDataProps[]);

    //load all components before opening the modal
    const wrapper = createWrapper();
    const buttonLoadingCheckBox = wrapper.findCheckbox('#checkbox-button1').findLabel().toSelector();
    const textLoadingCheckBox = wrapper.findCheckbox('#checkbox-text1').findLabel().toSelector();
    await page.click(buttonLoadingCheckBox);
    await page.click(textLoadingCheckBox);

    await page.click('[data-testid="modal-trigger"]');

    // default interval after which modal metrics are automatically emitted.
    const MODAL_READY_TIMEOUT = 100;
    await delay(MODAL_READY_TIMEOUT);

    const metrics = await getModalPerformanceMetrics();
    expect(metrics[0].instanceIdentifier).not.toBeNull();
    expect(metrics[0].timeToContentReadyInModal).toBe(0);
  })
);

test(
  'should not emit modal performance metrics more than once',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/modal/with-component-load');
    const getModalPerformanceMetrics = () =>
      browser.execute(() => ((window as any).modalPerformanceMetrics ?? []) as ModalPerformanceDataProps[]);
    await page.click('[data-testid="modal-trigger"]');

    //set loading state as false
    const wrapper = createWrapper();
    const buttonLoadingCheckBox = wrapper.findCheckbox('#checkbox-button2').findLabel().toSelector();
    const textLoadingCheckBox = wrapper.findCheckbox('#checkbox-text2').findLabel().toSelector();
    await page.click(buttonLoadingCheckBox);
    await page.click(textLoadingCheckBox);

    let metrics = await getModalPerformanceMetrics();
    expect(metrics[0].instanceIdentifier).not.toBeNull();
    expect(metrics[0].timeToContentReadyInModal).not.toBeNull();

    //reload the components
    await page.click(buttonLoadingCheckBox);
    await page.click(textLoadingCheckBox);

    await page.click(buttonLoadingCheckBox);
    await page.click(textLoadingCheckBox);

    metrics = await getModalPerformanceMetrics();
    expect(metrics.length).toBe(1);
  })
);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
