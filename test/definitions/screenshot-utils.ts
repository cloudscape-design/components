// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { cropAndCompare, parsePng } from '@cloudscape-design/browser-test-tools/image-utils';

import { RawScreenshot, RawScreenshotPageObject } from './raw-screenshot-page-object';
import { TestDefinition } from './types';

export const screenshotAreaSelector = '.screenshot-area';

export interface CropAndCompareResult {
  firstImage: Buffer;
  secondImage: Buffer;
  diffImage: Buffer | null;
  isEqual: boolean;
  diffPixels: number;
}

export function captureSingleScreenshot(
  page: RawScreenshotPageObject,
  testDef: TestDefinition
): Promise<RawScreenshot> {
  if (testDef.screenshotType === 'viewport') {
    return page.captureViewport();
  }
  return page.captureBySelector(screenshotAreaSelector);
}

/**
 * Compares two raw screenshots. If the compressed bytes are identical,
 * skips the expensive parsePng + cropAndCompare pipeline entirely.
 */
export async function compareScreenshots(newRaw: RawScreenshot, oldRaw: RawScreenshot): Promise<CropAndCompareResult> {
  // Fast path: identical compressed PNG bytes → images are the same.
  if (newRaw.rawBase64 === oldRaw.rawBase64) {
    const imageBuffer = Buffer.from(newRaw.rawBase64, 'base64');
    return { firstImage: imageBuffer, secondImage: imageBuffer, diffImage: null, isEqual: true, diffPixels: 0 };
  }

  // Images differ — decode and run pixelmatch to produce a diff image for the Allure report.
  // This only runs for failing tests, so the cost is acceptable.
  const firstPng = await parsePng(newRaw.rawBase64);
  const secondPng = await parsePng(oldRaw.rawBase64);

  // No cropping needed since takeElementScreenshot already produces cropped images.
  const firstScreenshot = {
    image: firstPng,
    offset: { top: 0, left: 0 },
    width: firstPng.width,
    height: firstPng.height,
  };

  const secondScreenshot = {
    image: secondPng,
    offset: { top: 0, left: 0 },
    width: secondPng.width,
    height: secondPng.height,
  };
  return cropAndCompare(firstScreenshot, secondScreenshot);
}
