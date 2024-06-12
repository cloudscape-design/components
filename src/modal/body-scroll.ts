// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import styles from './styles.css.js';
import { browserScrollbarSize } from '../internal/utils/browser-scrollbar-size';

// Read this before making changes to the code below.
//
// When a modal is used from an iframe the body scrolling utils take no effect because they need to be applied to another document.
// The customers replicate this behavior by running the same code on the correct document instance, see AWSUI-41915.
// Hence, we should avoid making changes to the component that break the body scrolling logic in its current form.

let initialBodyPaddingRightStyle: string | undefined = undefined;

export function disableBodyScrolling() {
  setBodyScrollbarPadding();
  document.body.classList.add(styles['modal-open']);
}

export function enableBodyScrolling() {
  document.body.classList.remove(styles['modal-open']);
  restoreBodyScrollbarPadding();
}

function setBodyScrollbarPadding() {
  if (bodyHasScrollbar()) {
    initialBodyPaddingRightStyle = document.body.style.paddingRight;
    const initialBodyPaddingRight = computedBodyPaddingRightPixels();
    const scrollbarWidth = browserScrollbarSize().width;
    const newBodyPaddingRight = initialBodyPaddingRight + scrollbarWidth;
    document.body.style.paddingRight = newBodyPaddingRight + 'px';
  }
}

function computedBodyPaddingRightPixels() {
  return parseInt(window.getComputedStyle(document.body).paddingRight, 10);
}

function restoreBodyScrollbarPadding() {
  if (initialBodyPaddingRightStyle) {
    document.body.style.setProperty('padding-right', initialBodyPaddingRightStyle);
  } else {
    document.body.style.removeProperty('padding-right');
  }
  initialBodyPaddingRightStyle = undefined;
}

function bodyHasScrollbar() {
  // Unfortunately this difference doesn't appear to match the scrollbar width during testing,
  // otherwise we could remove browserScrollbarSize().  Bootstrap also doesn't use this difference
  // directly.
  return document.body.clientWidth < window.innerWidth;
}
