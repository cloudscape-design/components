// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
declare global {
  interface SVGElement {
    getBBox(): DOMRect;
  }
}

export default function createBBoxMock() {
  const originalGetBBox = SVGElement.prototype.getBBox;

  return {
    value: { x: 0, y: 0, width: 0, height: 0 },
    setup() {
      SVGElement.prototype.getBBox = () => this.value as any;
      this.value = { x: 0, y: 0, width: 0, height: 0 } as any;
    },
    restore() {
      SVGElement.prototype.getBBox = originalGetBBox;
    },
  };
}
