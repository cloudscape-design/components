// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject, ElementRect } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';
import styles from '../../../lib/components/popover/styles.selectors.js';

const wrapper = createWrapper();
const triggerSelector = wrapper.findPopover().findTrigger().toSelector();
const containerSelector = wrapper.findPopover().findByClassName(styles.container).toSelector();
const arrowSelector = wrapper.findPopover().findByClassName(styles.arrow).toSelector();

const VIEWPORT_MOBILE = [360, 640] as const;
const VIEWPORT_TABLET = [768, 1024] as const;

interface SetupProps {
  position: 'top' | 'bottom' | 'left' | 'right';
  placement:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center-center'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  viewport: readonly [width: number, height: number];
  scrollLeft?: number;
  scrollTop?: number;
}

type Expectation = (trigger: ElementRect, container: ElementRect, arrow: ElementRect) => void;
type Scenario = [props: SetupProps, expectation: Expectation];

const centerBottom: Expectation = (trigger, container, arrow) => {
  const arrowCenter = arrow.left + arrow.width / 2;
  expect(trigger.bottom).toBeLessThan(container.top);
  expect(Math.round(arrowCenter - trigger.left)).toEqual(Math.round(trigger.right - arrowCenter));
};

const rightBottom: Expectation = (trigger, container, arrow) => {
  const triggerMiddle = trigger.top + trigger.height / 2;
  expect(trigger.right).toBeLessThan(container.left);
  expect(trigger.top).toBeLessThan(arrow.top);
  expect(trigger.bottom).toBeGreaterThan(arrow.bottom);
  expect(triggerMiddle - container.top).toBeLessThan(container.bottom - triggerMiddle);
};

const leftBottom: Expectation = (trigger, container, arrow) => {
  const triggerMiddle = trigger.top + trigger.height / 2;
  expect(trigger.left).toBeGreaterThan(container.right);
  expect(trigger.top).toBeLessThan(arrow.top);
  expect(trigger.bottom).toBeGreaterThan(arrow.bottom);
  expect(triggerMiddle - container.top).toBeLessThan(container.bottom - triggerMiddle);
};

const centerTop: Expectation = (trigger, container, arrow) => {
  const arrowCenter = arrow.left + arrow.width / 2;
  expect(trigger.top).toBeGreaterThan(container.bottom);
  expect(Math.round(arrowCenter - trigger.left)).toEqual(Math.round(trigger.right - arrowCenter));
};

const rightTop: Expectation = (trigger, container, arrow) => {
  const triggerMiddle = trigger.top + trigger.height / 2;
  expect(trigger.right).toBeLessThan(container.left);
  expect(trigger.top).toBeLessThan(arrow.top);
  expect(trigger.bottom).toBeGreaterThan(arrow.bottom);
  expect(triggerMiddle - container.top).toBeGreaterThan(container.bottom - triggerMiddle);
};

const leftTop: Expectation = (trigger, container, arrow) => {
  const triggerMiddle = trigger.top + trigger.height / 2;
  expect(trigger.left).toBeGreaterThan(container.right);
  expect(trigger.top).toBeLessThan(arrow.top);
  expect(trigger.bottom).toBeGreaterThan(arrow.bottom);
  expect(triggerMiddle - container.top).toBeGreaterThan(container.bottom - triggerMiddle);
};

const bottomRight: Expectation = (trigger, container) => {
  expect(trigger.bottom).toBeLessThan(container.top);
  expect(Math.round(trigger.left)).toEqual(Math.round(container.left));
};

const bottomLeft: Expectation = (trigger, container) => {
  expect(trigger.bottom).toBeLessThan(container.top);
  expect(Math.abs(trigger.right - container.right)).toBeLessThan(1);
};

const topRight: Expectation = (trigger, container) => {
  expect(trigger.top).toBeGreaterThan(container.bottom);
  expect(Math.round(trigger.left)).toEqual(Math.round(container.left));
};

const topLeft: Expectation = (trigger, container) => {
  expect(trigger.top).toBeGreaterThan(container.bottom);
  expect(Math.abs(trigger.right - container.right)).toBeLessThan(1);
};

const setupTest = (
  { position, placement, viewport: [width, height], scrollLeft = 0, scrollTop = 0 }: SetupProps,
  testFn: (page: BasePageObject) => Promise<void>
) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ width, height });
    await browser.url(`#/light/popover/placement-test?position=${position}&placement=${placement}`);
    await page.windowScrollTo({ left: scrollLeft, top: scrollTop });
    await testFn(page);
  });
};

describe('Default placement', () => {
  const scenarios: Scenario[] = [
    [{ position: 'bottom', placement: 'top-center', viewport: VIEWPORT_TABLET }, centerBottom],
    [{ position: 'right', placement: 'top-left', viewport: VIEWPORT_TABLET }, rightBottom],
    [{ position: 'left', placement: 'top-right', viewport: VIEWPORT_TABLET }, leftBottom],
    [{ position: 'top', placement: 'center-center', viewport: VIEWPORT_TABLET }, centerTop],
    [{ position: 'right', placement: 'bottom-left', viewport: VIEWPORT_TABLET, scrollTop: 500 }, rightTop],
    [{ position: 'left', placement: 'bottom-right', viewport: VIEWPORT_TABLET, scrollTop: 500 }, leftTop],
  ];

  for (const [props, expectation] of scenarios) {
    test(
      `Scenario: ${props.position}, ${props.placement}, ${props.viewport}`,
      setupTest(props, async page => {
        await page.click('#popover-trigger');
        const trigger = await page.getBoundingBox(triggerSelector);
        const container = await page.getBoundingBox(containerSelector);
        const arrow = await page.getBoundingBox(arrowSelector);
        expectation(trigger, container, arrow);
      })
    );
  }
});

describe('Fallback to vertical placement in mobile', () => {
  const scenarios: Scenario[] = [
    [{ position: 'right', placement: 'top-left', viewport: VIEWPORT_MOBILE }, bottomRight],
    [{ position: 'left', placement: 'top-right', viewport: VIEWPORT_MOBILE }, bottomLeft],
    [{ position: 'right', placement: 'bottom-left', viewport: VIEWPORT_MOBILE }, topRight],
    [{ position: 'left', placement: 'bottom-right', viewport: VIEWPORT_MOBILE }, topLeft],
  ];

  for (const [props, expectation] of scenarios) {
    test(
      `Scenario: ${props.position}, ${props.placement}, ${props.viewport}`,
      setupTest(props, async page => {
        await page.click('#popover-trigger');
        const trigger = await page.getBoundingBox(triggerSelector);
        const container = await page.getBoundingBox(containerSelector);
        const arrow = await page.getBoundingBox(arrowSelector);
        expectation(trigger, container, arrow);
      })
    );
  }
});
