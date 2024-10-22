// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import DropdownStatus from '../dropdown-status/index.js';
import InternalLiveRegion from '../live-region/internal';

import styles from './styles.css.js';

interface DropdownFooter {
  content?: React.ReactNode | null;
  hasItems?: boolean;
  id?: string;
}

const DropdownFooter: React.FC<DropdownFooter> = ({ content, id, hasItems = true }: DropdownFooter) => (
  <div className={clsx(styles.root, { [styles.hidden]: content === null, [styles['no-items']]: !hasItems })}>
    <InternalLiveRegion id={id}>{content && <DropdownStatus>{content}</DropdownStatus>}</InternalLiveRegion>
  </div>
);

export default DropdownFooter;
