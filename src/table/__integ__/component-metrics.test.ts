// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

interface ExtendedWindow extends Window {
  __awsuiComponentlMetrics__: Array<any>;
}
declare const window: ExtendedWindow;

class TableWithAnalyticsPageObject extends BasePageObject {
  async getComponentMetricsLog() {
    const componentsLog = await this.browser.execute(() => window.__awsuiComponentlMetrics__);
    return componentsLog;
  }
}

test(
  'component mount event includes table title without additional header slot information',
  useBrowser(async browser => {
    await browser.url('#/light/funnel-analytics/table');
    const page = new TableWithAnalyticsPageObject(browser);
    const componentsLog = await page.getComponentMetricsLog();
    expect(componentsLog.length).toBe(1);
    expect(componentsLog[0]).toMatchObject({
      componentConfiguration: {
        taskName: 'Table title',
      },
      componentName: 'table',
      taskInteractionId: expect.any(String),
    });
  })
);
