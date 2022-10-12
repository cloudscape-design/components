// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styles from './styles.css.js';

type ScreenreaderOnlyProps = Exclude<React.HTMLAttributes<HTMLDivElement>, 'className'>;

/**
 * Makes content now shown on a screen but still announced by screen-reader users.
 * The component is suitable when the aria-label cannot be used, e.g. to avoid elemnts being announced as "blank".
 *
 * To exclude screenreader-only content for testing use `wrapper.find(':not([data-screenreader-only])')`.
 */
export default function ScreenreaderOnly(props: ScreenreaderOnlyProps) {
  return <div {...props} className={styles.root} data-screenreader-only={true} />;
}
