// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Instrumented ScreenshotPageObject that logs performance timings.
 * Re-implements key methods to show which strategy is used and where time is spent.
 */
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import { parsePng } from '@cloudscape-design/browser-test-tools/image-utils';
import { ScreenshotPageObject, ScreenshotWithOffset } from '@cloudscape-design/browser-test-tools/page-objects';

type PermutationScreenshot = ScreenshotWithOffset & { id: string };

function ms(start: number): string {
  return `${(performance.now() - start).toFixed(0)}ms`;
}

export class InstrumentedPageObject extends ScreenshotPageObject {
  private label = '';

  setLabel(value: string) {
    this.label = value;
  }

  private log(msg: string) {
    console.log(`  ⏱ [${this.label}] ${msg}`);
  }

  async captureViewport(): Promise<ScreenshotWithOffset> {
    const t0 = performance.now();

    let t = performance.now();
    const { height, width } = await this.getViewportSize();
    this.log(`  getViewportSize: ${ms(t)}`);

    t = performance.now();
    const rawBase64 = await this.browser.takeScreenshot();
    this.log(`  takeScreenshot: ${ms(t)} (${(rawBase64.length / 1024).toFixed(0)}KB base64)`);

    t = performance.now();
    const image = await parsePng(rawBase64);
    this.log(`  parsePng: ${ms(t)}`);

    this.log(`captureViewport total: ${ms(t0)}`);
    return { image, offset: { top: 0, left: 0 }, height, width } as ScreenshotWithOffset;
  }

  async captureBySelector(selector: string, options: { viewportOnly?: boolean } = {}): Promise<ScreenshotWithOffset> {
    const t0 = performance.now();

    let t = performance.now();
    await this.waitForVisible(selector);
    this.log(`  waitForVisible: ${ms(t)}`);

    t = performance.now();
    const { pixelRatio, top, left } = await this.getViewportSize();
    this.log(`  getViewportSize: ${ms(t)}`);

    t = performance.now();
    const box = await this.getBoundingBox(selector);
    this.log(`  getBoundingBox: ${ms(t)}`);

    let rawBase64: string;
    if (options.viewportOnly) {
      t = performance.now();
      rawBase64 = await this.browser.takeScreenshot();
      this.log(`  takeScreenshot (viewportOnly): ${ms(t)} (${(rawBase64.length / 1024).toFixed(0)}KB)`);
    } else {
      t = performance.now();
      rawBase64 = await this.fullPageScreenshotInstrumented();
      this.log(`  fullPageScreenshot total: ${ms(t)} (${(rawBase64.length / 1024).toFixed(0)}KB)`);
    }

    t = performance.now();
    const image = await parsePng(rawBase64);
    this.log(
      `  parsePng: ${ms(t)} (${image.width}x${image.height}px, ${(image.data.length / 1024 / 1024).toFixed(1)}MB raw)`
    );

    const offset = { top: box.top, left: box.left };
    if (!options.viewportOnly) {
      offset.top += top;
      offset.left += left;
    }

    this.log(`captureBySelector total: ${ms(t0)}`);
    return { image, offset, pixelRatio, height: box.height, width: box.width } as ScreenshotWithOffset;
  }

  async capturePermutations(): Promise<PermutationScreenshot[]> {
    const t0 = performance.now();

    let t = performance.now();
    await this.windowScrollTo({ top: 0, left: 0 });
    this.log(`  windowScrollTo(0): ${ms(t)}`);

    // fitWindowHeightToContent
    t = performance.now();
    const originalWindowSize = await this.browser.getWindowSize();
    const { viewportHeight, pageHeight } = await (this.browser as any).execute(function () {
      return {
        viewportHeight: window.innerHeight,
        pageHeight: document.documentElement.scrollHeight,
      };
    });
    const windowUIHeight = originalWindowSize.height - viewportHeight;
    const targetHeight = pageHeight + windowUIHeight;
    await this.browser.setWindowSize(originalWindowSize.width, targetHeight);
    this.log(`  fitWindowHeightToContent: ${ms(t)} (pageHeight=${pageHeight}, targetWindowHeight=${targetHeight})`);

    // getPermutationSizes
    t = performance.now();
    const permutations: Array<{ id: string; width: number; height: number; offset: { top: number; left: number } }> =
      await (this.browser as any).execute(function () {
        const elements = document.querySelectorAll('[data-testid="permutation"]');
        return Array.from(elements).map(function (el: Element) {
          const rect = el.getBoundingClientRect();
          return {
            id: el.getAttribute('data-permutation-id') || rect.top + '-' + rect.left,
            width: rect.width,
            height: rect.height,
            offset: { top: rect.top, left: rect.left },
          };
        });
      });
    this.log(`  getPermutationSizes: ${ms(t)} (${permutations.length} found)`);

    if (permutations.length === 0) {
      throw new Error('No permutations found on current page.');
    }

    // fullPageScreenshot
    t = performance.now();
    const rawBase64 = await this.fullPageScreenshotInstrumented();
    this.log(`  fullPageScreenshot: ${ms(t)} (${(rawBase64.length / 1024).toFixed(0)}KB)`);

    // parsePng
    t = performance.now();
    const image = await parsePng(rawBase64);
    this.log(
      `  parsePng: ${ms(t)} (${image.width}x${image.height}px, ${(image.data.length / 1024 / 1024).toFixed(1)}MB raw pixels)`
    );

    // restore window size
    t = performance.now();
    await this.browser.setWindowSize(originalWindowSize.width, originalWindowSize.height);
    this.log(`  restoreWindowSize: ${ms(t)}`);

    this.log(`capturePermutations total: ${ms(t0)}`);
    return permutations.map(permutation => ({ ...permutation, image }) as PermutationScreenshot);
  }

  /**
   * Instrumented fullPageScreenshot that logs which strategy is selected.
   */
  private async fullPageScreenshotInstrumented(): Promise<string> {
    const scrollPosition = await this.getWindowScroll();
    await this.waitForJsTimers();

    const browserName = (this.browser.capabilities as any)?.browserName || '';
    if (browserName.toLowerCase().includes('firefox')) {
      this.log(`    strategy: scroll-and-merge (Firefox detected)`);
      const result = await super.fullPageScreenshot();
      return result;
    }

    // Try Puppeteer
    let t = performance.now();
    let puppeteer: any = null;
    try {
      puppeteer = await (this.browser as any).getPuppeteer();
    } catch (e: any) {
      this.log(`    getPuppeteer failed: ${e.message?.substring(0, 80)}`);
    }
    const getPuppeteerTime = performance.now() - t;

    if (puppeteer && !this.forceScrollAndMerge) {
      this.log(`    strategy: PUPPETEER (getPuppeteer: ${getPuppeteerTime.toFixed(0)}ms)`);
      t = performance.now();
      const image = await (this.browser as any).call(async () => {
        const [current] = await puppeteer.pages();
        return current.screenshot({ fullPage: true, encoding: 'base64' });
      });
      this.log(`    puppeteer.screenshot: ${ms(t)}`);
      await this.windowScrollTo(scrollPosition);
      return image as string;
    }

    this.log(
      `    strategy: SCROLL-AND-MERGE (puppeteer=${!!puppeteer}, forceScrollAndMerge=${this.forceScrollAndMerge}, getPuppeteer: ${getPuppeteerTime.toFixed(0)}ms)`
    );
    // Delegate to parent which implements the scroll-and-merge properly
    const result = await super.fullPageScreenshot();
    return result;
  }
}

// ─── Instrumented cropAndCompare ──────────────────────────────────────────────

interface CropAndCompareResult {
  firstImage: Buffer;
  secondImage: Buffer;
  diffImage: Buffer | null;
  isEqual: boolean;
  diffPixels: number;
}

function cropImage(inImage: PNG, rect: { top: number; left: number; width: number; height: number }, pixelRatio = 1) {
  const imageWidth = Math.ceil(rect.width * pixelRatio || inImage.width);
  const imageHeight = Math.ceil(rect.height * pixelRatio || inImage.height);
  const outImage = new PNG({ width: imageWidth, height: imageHeight });
  const safeLeft = Math.max(Math.round(rect.left), 0) * pixelRatio;
  const safeTop = Math.max(Math.round(rect.top), 0) * pixelRatio;
  const safeWidth = Math.min(imageWidth, inImage.width - safeLeft);
  const safeHeight = Math.min(imageHeight, inImage.height - safeTop);
  inImage.bitblt(outImage, safeLeft, safeTop, safeWidth, safeHeight, 0, 0);
  return outImage;
}

function packPng(png: PNG): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = png.pack();
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

/**
 * Instrumented cropAndCompare with per-step timing logs.
 */
export async function instrumentedCropAndCompare(
  firstScreenshot: ScreenshotWithOffset,
  secondScreenshot: ScreenshotWithOffset,
  label = ''
): Promise<CropAndCompareResult> {
  const t0 = performance.now();
  const prefix = label ? `[${label}] ` : '';

  // Fast path: raw base64 equality
  const rawFirst = (firstScreenshot as any).rawBase64;
  const rawSecond = (secondScreenshot as any).rawBase64;
  if (rawFirst && rawSecond && rawFirst === rawSecond) {
    const t = performance.now();
    const imageBuffer = Buffer.from(rawFirst, 'base64');
    console.log(`  ⏱ ${prefix}cropAndCompare: ${ms(t0)} (FAST PATH: rawBase64 identical, decode: ${ms(t)})`);
    return { firstImage: imageBuffer, secondImage: imageBuffer, diffImage: null, isEqual: true, diffPixels: 0 };
  }

  // Crop
  const pixelRatio = firstScreenshot.pixelRatio || 1;
  const size = {
    height: Math.round(Math.max(firstScreenshot.height, secondScreenshot.height)),
    width: Math.round(Math.max(firstScreenshot.width, secondScreenshot.width)),
  };
  const scaledSize = {
    width: Math.ceil(size.width * pixelRatio),
    height: Math.ceil(size.height * pixelRatio),
  };

  let t = performance.now();
  const firstImage = cropImage(
    firstScreenshot.image,
    { top: firstScreenshot.offset.top, left: firstScreenshot.offset.left, width: size.width, height: size.height },
    pixelRatio
  );
  const secondImage = cropImage(
    secondScreenshot.image,
    { top: secondScreenshot.offset.top, left: secondScreenshot.offset.left, width: size.width, height: size.height },
    pixelRatio
  );
  console.log(
    `  ⏱ ${prefix}  crop (2 images): ${ms(t)} (${scaledSize.width}x${scaledSize.height}px, src: ${firstScreenshot.image.width}x${firstScreenshot.image.height}px)`
  );

  // Pixel comparison
  t = performance.now();
  let diffPixels: number;
  let diffImage: PNG | null = null;
  if (scaledSize.width === 0 || scaledSize.height === 0) {
    diffPixels = -1;
  } else if (firstImage.data.equals(secondImage.data)) {
    diffPixels = 0;
    console.log(`  ⏱ ${prefix}  compareImages: ${ms(t)} (FAST: pixel buffers identical)`);
  } else {
    diffImage = new PNG({ width: scaledSize.width, height: scaledSize.height });
    diffPixels = pixelmatch(firstImage.data, secondImage.data, diffImage.data, scaledSize.width, scaledSize.height, {
      threshold: 0.01,
    });
    console.log(`  ⏱ ${prefix}  pixelmatch: ${ms(t)} (diffPixels=${diffPixels})`);
  }

  // Pack PNGs
  t = performance.now();
  const [firstPacked, secondPacked, diffPacked] = await Promise.all([
    packPng(firstImage),
    packPng(secondImage),
    diffImage ? packPng(diffImage) : Promise.resolve(null),
  ]);
  console.log(`  ⏱ ${prefix}  packPng (${diffImage ? 3 : 2} images): ${ms(t)}`);

  console.log(`  ⏱ ${prefix}cropAndCompare total: ${ms(t0)} (diffPixels=${diffPixels})`);
  return {
    firstImage: firstPacked,
    secondImage: secondPacked,
    diffImage: diffPacked,
    isEqual: diffPixels >= 0 && diffPixels <= 1,
    diffPixels,
  };
}
