// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect } from 'react';
import styles from './styles.css.js';
import InternalBox from '../box/internal';
import { TocProps } from './interfaces';
import { checkSafeUrl } from '../internal/utils/check-safe-url.js';

const Anchor = ({ id, text, level }: TocProps.Anchor) => {
  checkSafeUrl('SideNavigation', id);

  return (
    <li
      key={id}
      style={{
        paddingLeft: `${level * 20}px`,
      }}
    >
      <a href={`#${id}`}>{text}</a>
    </li>
  );
};

export default function InternalToc({ anchors, ...props }: TocProps) {
  return (
    <div className={styles.root}>
      <InternalBox variant="h4">{props.title}</InternalBox>
      <ul>
        {anchors.map((props, index) => (
          <Anchor key={index} {...props} />
        ))}
      </ul>
    </div>
  );
}
