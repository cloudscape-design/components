// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

export default class DndPageObject extends BasePageObject {
  async mouseDown(selector: string) {
    const center = await this.getElementCenter(selector);
    await (await this.browser.$(selector)).moveTo();
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'event',
        parameters: { pointerType: 'mouse' },
        actions: [
          { type: 'pointerMove', duration: 0, origin: 'pointer', ...center },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
        ],
      },
    ]);
  }

  async mouseMove(xOffset: number, yOffset: number) {
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'event',
        parameters: { pointerType: 'mouse' },
        actions: [
          { type: 'pointerMove', duration: 100, origin: 'pointer', x: xOffset, y: yOffset },
          { type: 'pause', duration: 150 },
        ],
      },
    ]);
  }

  async mouseUp() {
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'event',
        parameters: { pointerType: 'mouse' },
        actions: [
          { type: 'pointerUp', button: 0 },
          { type: 'pause', duration: 100 },
        ],
      },
    ]);
  }

  async dragAndDropTo(fromSelector: string, targetSelector: string, offsetX = 0, offsetY = 0) {
    await this.dragTo(fromSelector, targetSelector, offsetX, offsetY);
    await this.mouseUp();
  }

  async dragTo(fromSelector: string, targetSelector: string, offsetX = 0, offsetY = 0) {
    const fromCenter = await this.getElementCenter(fromSelector);
    const targetCenter = await this.getElementCenter(targetSelector);
    offsetX += targetCenter.x - fromCenter.x;
    offsetY += targetCenter.y - fromCenter.y;

    await this.mouseDown(fromSelector);
    await this.mouseMove(offsetX, offsetY);
  }

  async getElementCenter(selector: string) {
    const targetRect = await this.getBoundingBox(selector);
    const x = Math.round(targetRect.left + targetRect.width / 2);
    const y = Math.round(targetRect.top + targetRect.height / 2);
    return { x, y };
  }
}
