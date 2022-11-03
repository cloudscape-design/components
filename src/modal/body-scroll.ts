// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import styles from './styles.css.js';
import { browserScrollbarSize } from '../internal/utils/browser-scrollbar-size';

let initialBodyPaddingRightStyle: string | undefined = undefined;

export function disableScrolling(target: HTMLElement = document.body) {
  setScrollbarPadding(target);
  target.classList.add(styles['modal-open']);
}

export function enableScrolling(target: HTMLElement = document.body) {
  target.classList.remove(styles['modal-open']);
  restoreScrollbarPadding(target);
}

function setScrollbarPadding(target: HTMLElement = document.body) {
  if (targetHasScrollbar(target)) {
    initialBodyPaddingRightStyle = target.style.paddingRight;
    const initialBodyPaddingRight = computedBodyPaddingRightPixels();
    const scrollbarWidth = browserScrollbarSize().width;
    const newBodyPaddingRight = initialBodyPaddingRight + scrollbarWidth;
    target.style.paddingRight = newBodyPaddingRight + 'px';
  }
}

function computedBodyPaddingRightPixels(target: HTMLElement = document.body) {
  return parseInt(window.getComputedStyle(target).paddingRight, 10);
}

function restoreScrollbarPadding(target: HTMLElement = document.body) {
  if (initialBodyPaddingRightStyle) {
    target.style.setProperty('padding-right', initialBodyPaddingRightStyle);
  } else {
    target.style.removeProperty('padding-right');
  }
  initialBodyPaddingRightStyle = undefined;
}

function targetHasScrollbar(target: HTMLElement = document.body) {
  // Unfortunately this difference doesn't appear to match the scrollbar width during testing,
  // otherwise we could remove browserScrollbarSize().  Bootstrap also doesn't use this difference
  // directly.
  return target.clientWidth < window.innerWidth;
}
