// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Local copy of RawScreenshotPageObject from browser-test-tools
// (dev-v3-jotresse-optimized-screenshots branch). Once that branch is merged,
// this file can be replaced with a direct import from browser-test-tools.

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

/**
 * A raw screenshot with base64 data and dimensions. No decoded image, no offset.
 */
export interface RawScreenshot {
  rawBase64: string;
  width: number;
  height: number;
  pixelRatio?: number;
}

/**
 * Raw permutation screenshot captured via takeElementScreenshot.
 * No decoded image, no offset — just the raw base64 PNG per element.
 */
export interface RawPermutationScreenshot extends RawScreenshot {
  id: string;
}

/**
 * A page object that captures screenshots using takeElementScreenshot.
 * Returns raw base64 PNGs without decoding, cropping, or re-encoding —
 * significantly faster when pixel-level comparison can be done on raw bytes.
 */
export class RawScreenshotPageObject extends BasePageObject {
  async captureBySelector(selector: string): Promise<RawScreenshot> {
    await this.waitForVisible(selector);
    const { pixelRatio } = await this.getViewportSize();
    const box = await this.getBoundingBox(selector);

    const originalWindowSize = await this.fitWindowHeightToContent();
    const element = this.browser.$(selector);
    const elementId = await element.elementId;
    const rawBase64 = await this.browser.takeElementScreenshot(elementId);
    await this.safeSetWindowSize(originalWindowSize.width, originalWindowSize.height);

    return { rawBase64, pixelRatio, height: box.height, width: box.width };
  }

  async captureViewport(): Promise<RawScreenshot> {
    const { height, width } = await this.getViewportSize();
    const rawBase64 = await this.browser.takeScreenshot();
    return { rawBase64, height, width };
  }

  async capturePermutations(): Promise<RawPermutationScreenshot[]> {
    await this.windowScrollTo({ top: 0, left: 0 });

    // Adapt viewport height to fit all elements before taking screenshots
    const originalWindowSize = await this.fitWindowHeightToContent();

    const elements = await this.browser.$$('[data-permutation]').map(el => el);
    if (elements.length === 0) {
      await this.safeSetWindowSize(originalWindowSize.width, originalWindowSize.height);
      throw new Error('No permutations found on current page.');
    }

    const { pixelRatio } = await this.getViewportSize();
    const results: RawPermutationScreenshot[] = [];
    for (const element of elements) {
      const id = (await element.getAttribute('data-permutation')) || '';
      const elementId = await element.elementId;
      const rawBase64 = await this.browser.takeElementScreenshot(elementId);
      const size = await element.getSize();
      results.push({
        id,
        rawBase64,
        width: size.width * pixelRatio,
        height: size.height * pixelRatio,
      });
    }

    await this.safeSetWindowSize(originalWindowSize.width, originalWindowSize.height);
    return results;
  }

  private async fitWindowHeightToContent(): Promise<{ width: number; height: number }> {
    const originalWindowSize = await this.browser.getWindowSize();
    const dims: { viewportHeight: number; pageHeight: number } = await this.browser.execute(() => ({
      viewportHeight: window.innerHeight,
      pageHeight: document.documentElement.scrollHeight,
    }));
    const windowUIHeight = originalWindowSize.height - dims.viewportHeight;
    await this.safeSetWindowSize(originalWindowSize.width, dims.pageHeight + windowUIHeight);
    return originalWindowSize;
  }

  private async safeSetWindowSize(width: number, height: number): Promise<void> {
    try {
      await this.browser.setWindowSize(width, height);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Method has not yet been implemented')) {
        console.log('setWindowSize is not supported on this device');
      } else {
        throw error;
      }
    }
  }
}
