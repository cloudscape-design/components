// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, ExpandableSection } from '~components';

import styles from './styles.scss';

interface KeyValuePairProps {
  items: Array<{
    key: string;
    value: string;
  }>;
  header?: string;
}

function KeyValuePairTable(props: KeyValuePairProps) {
  return (
    <ExpandableSection defaultExpanded={true} variant="footer" headerText={props.header}>
      {props.items.map((item, index) => (
        <div className={styles.kvp} key={index}>
          <Box fontWeight="bold">{item.key}</Box>
          <Box>
            <div className={styles.shortcut}>{item.value}</div>
          </Box>
        </div>
      ))}
    </ExpandableSection>
  );
}

export default KeyValuePairTable;
