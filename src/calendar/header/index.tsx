// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from '../styles.css.js';
import { HeaderPrevButton, HeaderNextButton } from './header-button';

interface CalendarHeaderProps {
  formattedDate: string;
  onChange: (n: number) => void;
  previousLabel?: string;
  nextLabel?: string;
  headingId: string;
}

const CalendarHeader = ({ formattedDate, onChange, previousLabel, nextLabel, headingId }: CalendarHeaderProps) => {
  return (
    <div className={styles['calendar-header']}>
      <HeaderPrevButton ariaLabel={previousLabel} onChange={onChange} />
      <h2 className={styles['calendar-header-title']} id={headingId}>
        {formattedDate}
      </h2>
      <HeaderNextButton ariaLabel={nextLabel} onChange={onChange} />
    </div>
  );
};

export default CalendarHeader;
