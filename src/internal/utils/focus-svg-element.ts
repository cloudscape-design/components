// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export default function focusSvgElement(element: SVGElement) {
  if (element.focus) {
    element.focus();
  } else {
    // Deferring in a timeout because IE11 is not updating `tabIndex` and `focusable` attributes on time for some reason.
    setTimeout(() => {
      // IE11 does not implement .focus on SVG elements, but the HTMLElement version works.
      window.HTMLElement.prototype.focus.call(element);
    }, 0);
  }
}
