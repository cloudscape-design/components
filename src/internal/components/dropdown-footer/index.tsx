// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';
import DropdownStatus from '../dropdown-status/index.js';

interface DropdownFooter {
  content?: React.ReactNode | null;
  hasItems?: boolean;
}

const DropdownFooter: React.FC<DropdownFooter> = ({ content, hasItems = true }: DropdownFooter) => (
  <div
    className={clsx(styles.root, { [styles.hidden]: content === null, [styles['no-items']]: !hasItems })}
    aria-live="polite"
    aria-atomic="true"
  >
    {content && <DropdownStatus>{content}</DropdownStatus>}
  </div>
);

export default DropdownFooter;
