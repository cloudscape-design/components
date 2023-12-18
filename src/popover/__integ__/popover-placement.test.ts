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
  triggerHeight?: number;
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
  expect(trigger.left).toBeLessThan(container.left);
};

const bottomLeft: Expectation = (trigger, container) => {
  expect(trigger.bottom).toBeLessThan(container.top);
  expect(trigger.right).toBeGreaterThan(container.right);
};

const topRight: Expectation = (trigger, container) => {
  expect(trigger.top).toBeGreaterThan(container.bottom);
  expect(trigger.left).toBeLessThan(container.left);
};

const topLeft: Expectation = (trigger, container) => {
  expect(trigger.top).toBeGreaterThan(container.bottom);
  expect(trigger.right).toBeGreaterThan(container.right);
};

const setupTest = (
  { position, placement, viewport: [width, height] }: SetupProps,
  testFn: (page: BasePageObject) => Promise<void>
) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ width, height });
    await browser.url(`#/light/popover/placement-test?position=${position}&placement=${placement}`);
    // Scroll past the top bar and the page header, all the way to the bottom so that the grid (height: 100vh) fits the viewport exactly.
    await page.windowScrollTo({ top: height });
    await testFn(page);
  });
};

function formatSetupDescription(props: SetupProps) {
  return Object.entries(props)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
}

describe('Default placement', () => {
  const scenarios: Scenario[] = [
    [{ position: 'bottom', placement: 'top-center', viewport: VIEWPORT_TABLET }, centerBottom],
    [{ position: 'right', placement: 'top-left', viewport: VIEWPORT_TABLET }, rightBottom],
    [{ position: 'left', placement: 'top-right', viewport: VIEWPORT_TABLET }, leftBottom],
    [{ position: 'top', placement: 'center-center', viewport: VIEWPORT_TABLET }, centerTop],
    [{ position: 'right', placement: 'bottom-left', viewport: VIEWPORT_TABLET }, rightTop],
    [{ position: 'left', placement: 'bottom-right', viewport: VIEWPORT_TABLET }, leftTop],
  ];

  for (const [props, expectation] of scenarios) {
    test(
      formatSetupDescription(props),
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
    [{ position: 'right', placement: 'top-center', viewport: VIEWPORT_MOBILE, triggerHeight: 400 }, centerBottom],
    [{ position: 'left', placement: 'top-center', viewport: VIEWPORT_MOBILE, triggerHeight: 400 }, centerBottom],
    [{ position: 'right', placement: 'center-center', viewport: VIEWPORT_MOBILE, triggerHeight: 400 }, centerBottom],
    [{ position: 'left', placement: 'center-center', viewport: VIEWPORT_MOBILE, triggerHeight: 400 }, centerBottom],
    [{ position: 'right', placement: 'bottom-center', viewport: VIEWPORT_MOBILE, triggerHeight: 400 }, centerTop],
    [{ position: 'left', placement: 'bottom-center', viewport: VIEWPORT_MOBILE, triggerHeight: 400 }, centerTop],
  ];

  for (const [props, expectation] of scenarios) {
    test(
      formatSetupDescription(props),
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

test(
  `Large size popover should fallback to medium size in mobile`,
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/popover/scenarios');

    const wrapper = createWrapper();
    const largePopover = wrapper.findPopover('#large-popover');
    const triggerSelector = largePopover.findTrigger().toSelector();
    const containerSelector = largePopover.findByClassName(styles.container).toSelector();
    await page.click(triggerSelector);
    const { width: desktopContainerWidth } = await page.getBoundingBox(containerSelector);
    expect(desktopContainerWidth).toEqual(480);

    // Set mobile window size
    const [width, height] = VIEWPORT_MOBILE;
    await page.setWindowSize({ width, height });
    const { width: mobileContainerWidth } = await page.getBoundingBox(containerSelector);
    expect(mobileContainerWidth).toEqual(310);
  })
);

test(
  'top-center falls back to top-side if cannot open top-center or bottom-center',
  setupTest({ position: 'top', placement: 'bottom-right', viewport: VIEWPORT_TABLET }, async page => {
    await page.click('#popover-trigger');
    const trigger = await page.getBoundingBox(triggerSelector);
    const container = await page.getBoundingBox(containerSelector);
    const arrow = await page.getBoundingBox(arrowSelector);
    topLeft(trigger, container, arrow);
  })
);

test(
  'bottom-center falls back to bottom-side if cannot open bottom-center or top-center',
  setupTest({ position: 'bottom', placement: 'top-right', viewport: VIEWPORT_TABLET }, async page => {
    await page.click('#popover-trigger');
    const trigger = await page.getBoundingBox(triggerSelector);
    const container = await page.getBoundingBox(containerSelector);
    const arrow = await page.getBoundingBox(arrowSelector);
    bottomLeft(trigger, container, arrow);
  })
);
