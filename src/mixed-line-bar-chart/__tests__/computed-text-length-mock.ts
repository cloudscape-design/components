// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
declare global {
  interface SVGElement {
    getComputedTextLength(): number;
  }
}

export default function createComputedTextLengthMock() {
  const originalGetComputedTextLength = SVGElement.prototype.getComputedTextLength;

  return {
    value: 0,
    setup() {
      SVGElement.prototype.getComputedTextLength = () => this.value;
      this.value = 0;
    },
    restore() {
      SVGElement.prototype.getComputedTextLength = originalGetComputedTextLength;
    },
  };
}
