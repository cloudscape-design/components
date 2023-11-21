// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import styles from './styles.css.js';
import expandabeleSectionHeaderStyles from '../../../expandable-section/styles.css.js';

export default function getSeriesDetailsText(element: HTMLElement) {
  const keyValuePairs = Array.from(element.querySelectorAll(`.${styles['key-value-pair']}`));
  const expandableSectionHeaders = Array.from(element.querySelectorAll(`.${expandabeleSectionHeaderStyles.header}`));
  return [...keyValuePairs, ...expandableSectionHeaders]
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
