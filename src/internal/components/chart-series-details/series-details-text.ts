// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import styles from './styles.css.js';
import expandabeleSectionHeaderStyles from '../../../expandable-section/styles.css.js';

export default function getSeriesDetailsText(element: HTMLElement) {
  const elementsWithText = Array.from(
    element.querySelectorAll(`.${styles.announced},.${expandabeleSectionHeaderStyles.header}`)
  );
  return elementsWithText
    .map(element => {
      if (element instanceof HTMLElement) {
        return element.innerText
          ?.split('\n')
          .map(s => s.trim())
          .join(' ')
          .trim();
      }
    })
    .filter(Boolean)
    .join(', ');
}
