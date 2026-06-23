// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Extends ScreenshotPageObject with optimized capture methods that use
 * takeElementScreenshot instead of full-page screenshot + crop + re-encode.
 *
 * This avoids the expensive parsePng/packPng pipeline for identical images
 * by returning raw base64 PNGs that can be compared as strings.
 */
import { ScreenshotPageObject } from '@cloudscape-design/browser-test-tools/page-objects';

interface RawScreenshot {
  rawBase64: string;
  width: number;
  height: number;
  pixelRatio?: number;
  id?: string;
}

export type { RawScreenshot };

export class OptimizedPageObject extends ScreenshotPageObject {
  /**
   * Captures the screenshot area using takeElementScreenshot.
   * Returns the raw base64 PNG without decoding — suitable for fast string comparison.
   * Falls back to the parent's captureBySelector if takeElementScreenshot fails.
   */
  async captureSelectorRaw(selector: string): Promise<RawScreenshot> {
    await this.waitForVisible(selector);
    const { pixelRatio } = await this.getViewportSize();
    const box = await this.getBoundingBox(selector);

    try {
      const originalWindowSize = await this.browser.getWindowSize();
      // Fit window height to content so the element is fully visible
      const dims: { viewportHeight: number; pageHeight: number } = await this.browser.execute(() => ({
        viewportHeight: window.innerHeight,
        pageHeight: document.documentElement.scrollHeight,
      }));
      const windowUIHeight = originalWindowSize.height - dims.viewportHeight;
      await this.browser.setWindowSize(originalWindowSize.width, dims.pageHeight + windowUIHeight);

      const element = this.browser.$(selector);
      const rawBase64 = await this.browser.takeElementScreenshot(await element.elementId);

      // Restore window size
      await this.browser.setWindowSize(originalWindowSize.width, originalWindowSize.height);

      return { rawBase64, pixelRatio, width: box.width, height: box.height };
    } catch {
      // Fallback: use full-page screenshot (will need parsePng later if comparison fails)
      console.warn('takeElementScreenshot failed, falling back to fullPageScreenshot');
      const rawBase64 = await this.fullPageScreenshot();
      return { rawBase64, pixelRatio, width: box.width, height: box.height };
    }
  }

  /**
   * Captures a viewport screenshot as raw base64.
   */
  async captureViewportRaw(): Promise<RawScreenshot> {
    const { height, width } = await this.getViewportSize();
    const rawBase64 = await this.browser.takeScreenshot();
    return { rawBase64, width, height };
  }

  /**
   * Captures each permutation element individually using takeElementScreenshot.
   * Returns raw base64 PNGs — no decode, no crop, no re-encode.
   * Falls back to the parent's capturePermutations if takeElementScreenshot fails.
   */
  async capturePermutationsRaw(): Promise<RawScreenshot[]> {
    await this.windowScrollTo({ top: 0, left: 0 });

    // Fit window height to content
    const originalWindowSize = await this.browser.getWindowSize();
    const dims: { viewportHeight: number; pageHeight: number } = await this.browser.execute(() => ({
      viewportHeight: window.innerHeight,
      pageHeight: document.documentElement.scrollHeight,
    }));
    const windowUIHeight = originalWindowSize.height - dims.viewportHeight;
    await this.browser.setWindowSize(originalWindowSize.width, dims.pageHeight + windowUIHeight);

    const elements = await this.browser.$$('[data-permutation]');
    if ((await elements.length) === 0) {
      await this.browser.setWindowSize(originalWindowSize.width, originalWindowSize.height);
      throw new Error('No permutations found on current page.');
    }

    try {
      const pixelRatio: number = await this.browser.execute(() => window.devicePixelRatio || 1);
      const results: RawScreenshot[] = [];

      for (const element of elements) {
        const id = (await element.getAttribute('data-permutation')) || '';
        const rawBase64 = await this.browser.takeElementScreenshot(element.elementId);
        const size = await element.getSize();
        results.push({
          id,
          rawBase64,
          width: size.width * pixelRatio,
          height: size.height * pixelRatio,
        });
      }

      await this.browser.setWindowSize(originalWindowSize.width, originalWindowSize.height);
      return results;
    } catch {
      console.warn('takeElementScreenshot failed for permutations, falling back to full-page strategy');
      await this.browser.setWindowSize(originalWindowSize.width, originalWindowSize.height);
      // Fall back to the parent's approach
      const permutations = await super.capturePermutations();
      return permutations.map(p => ({
        id: (p as any).id || '',
        rawBase64: '', // Will force slow-path comparison
        width: p.width,
        height: p.height,
      }));
    }
  }
}
