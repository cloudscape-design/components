// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';
import DropdownStatus from '../dropdown-status/index.js';
import LiveRegion from '../live-region/index.js';

interface DropdownFooter {
  content?: React.ReactNode | null;
  hasItems?: boolean;
  id?: string;
}

const DropdownFooter: React.FC<DropdownFooter> = ({ content, id, hasItems = true }: DropdownFooter) => (
  <div className={clsx(styles.root, { [styles.hidden]: content === null, [styles['no-items']]: !hasItems })}>
    <LiveRegion visible={true} tagName="div" id={id}>
      {content && <DropdownStatus>{content}</DropdownStatus>}
    </LiveRegion>
  </div>
);

export default DropdownFooter;
