// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { isMotionDisabled } from '@cloudscape-design/component-toolkit/internal';

const smoothScroll = (element: HTMLElement, to: number) => {
  if (isMotionDisabled(element) || !element.scrollTo) {
    element.scrollLeft = to;
  } else {
    // istanbul ignore next: unit tests always have motion disabled
    element.scrollTo({
      left: to,
      behavior: 'smooth',
    });
  }
};

export default smoothScroll;
