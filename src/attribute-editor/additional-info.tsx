// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';

interface AdditionalInfoProps {
  children: React.ReactNode;
}

export const AdditionalInfo = ({ children }: AdditionalInfoProps) => (
  <div className={styles['additional-info']}>{children}</div>
);
