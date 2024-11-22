// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { add as addTime, format } from 'date-fns';

import { Badge, Link, StatusIndicator } from '~components';
import { TimelineProps } from '~components/timeline/interfaces';

// import CustomSvg from "./assets/alarm-ringing.svg";
import styles from './styles.scss';

const i18nStrings: TimelineProps.I18nStrings = {
  stepNumberLabel: (stepNumber: number) => `Timeline Step ${stepNumber}`,
};

const dateFormat = 'MMM do yyyy HH:mm:ss';
const steps: TimelineProps.Step[] = [
  {
    title: 'ECO requested',
    completed: false,
    content: (
      <div className={styles['step-content']}>
        <div className={styles['content-text']}>Content 1</div>
        <div className={styles['time-text']}>{format(addTime(new Date(), { hours: -2 }), dateFormat)}</div>
      </div>
    ),
    statusSlot: <Badge color="green">Done</Badge>,
    iconName: 'status-pending',
    items: [
      {
        title: 'ECO researched',
        completed: true,
        content: (
          <div className={styles['step-content']}>
            <div className={styles['content-text']}>Content 1</div>
            <div className={styles['time-text']}>{format(addTime(new Date(), { days: -2 }), dateFormat)}</div>
          </div>
        ),
        statusSlot: <Badge color="green">Done</Badge>,
        iconName: 'face-happy',
      },
      {
        title: 'ECO data collected',
        completed: true,
        content: (
          <div className={styles['step-content']}>
            <div className={styles['content-text']}>Content 1</div>
            <div className={styles['time-text']}>{format(addTime(new Date(), { days: -1, hours: 3 }), dateFormat)}</div>
          </div>
        ),
        statusSlot: <Badge color="green">Done</Badge>,
      },
    ],
  },
  {
    title: 'ECD Approval Submitted',
    completed: true,
    content: (
      <div className={styles['step-content']}>
        <div className={styles['content-text']}>Content 2</div>
        <div className={styles['time-text']}>{format(addTime(new Date(), { days: -220 }), dateFormat)}</div>
      </div>
    ),
    action: <Link href="#">Click Link</Link>,
    statusSlot: <StatusIndicator type="success">Ongoing</StatusIndicator>,
  },
  {
    title: 'ECD Approval Initiated',
    completed: false,
    content: (
      <div className={styles['step-content']}>
        <div className={styles['content-text']}>Content 2</div>
        <div className={styles['time-text']}>{format(addTime(new Date(), { days: -20 }), dateFormat)}</div>
      </div>
    ),
    action: <Link href="#">Click Link</Link>,
    statusSlot: <StatusIndicator type="in-progress">Ongoing</StatusIndicator>,
    iconName: 'status-negative',
    status: 'error',
    items: [
      {
        title: 'ECD Approval Added to Queue',
        completed: false,
        content: (
          <div className={styles['step-content']}>
            <div className={styles['content-text']}>Some content</div>
            <div className={styles['time-text']}>{format(addTime(new Date(), { days: -12 }), dateFormat)}</div>
          </div>
        ),
        statusSlot: <Badge color="severity-neutral">Completed</Badge>,
      },
      {
        title: 'ECD Approval Scheduled',
        completed: false,
        content: (
          <div className={styles['step-content']}>
            <div className={styles['content-text']}>Content 2</div>
            <div className={styles['time-text']}>{format(addTime(new Date(), { days: -20 }), dateFormat)}</div>
          </div>
        ),
        statusSlot: <StatusIndicator type="error">Needs work</StatusIndicator>,
        iconName: 'status-negative',
        status: 'error',
      },
      {
        title: 'ECD Approval Reviewed',
        completed: false,
        content: (
          <div className={styles['step-content']}>
            <div className={styles['content-text']}>Content 2</div>
            <div className={styles['time-text']}>{format(addTime(new Date(), { days: -20 }), dateFormat)}</div>
          </div>
        ),
        statusSlot: <Badge color="severity-neutral">Not Started</Badge>,
      },
    ],
  },
  {
    title: 'ECD Approved',
    completed: false,
    content: (
      <div className={styles['step-content']}>
        <div className={styles['content-text']}>Content 2</div>
        <div className={styles['time-text']}>{format(addTime(new Date(), { days: 2 }), dateFormat)}</div>
      </div>
    ),
    action: <Link href="#">Click Link</Link>,
    statusSlot: <Badge color="severity-neutral">Not Started</Badge>,
  },
];

export { i18nStrings, steps };
