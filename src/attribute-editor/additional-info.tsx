// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import LiveRegion from '../internal/components/live-region';
import styles from './styles.css.js';

interface AdditionalInfoProps {
  children: React.ReactNode;
  id: string;
}

export const AdditionalInfo = ({ children, id }: AdditionalInfoProps) => (
  <LiveRegion visible={true}>
    <span id={id} className={styles['additional-info']}>
      {children}
    </span>
  </LiveRegion>
);
