// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ReactMarkdown from 'react-markdown';

import Button from '~components/button';
import Link from '~components/link';
import Popover from '~components/popover';
import { StepsProps } from '~components/steps';

import createPermutations from '../utils/permutations';

import styles from './styles.scss';

const initialSteps: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'loading',
    header: 'Listing EC2 instances',
    details: <ReactMarkdown className={styles.markdown}>Using the ec2_DescribeInstances</ReactMarkdown>,
  },
];

const loadingSteps: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'success',
    header: <div style={{ margin: '0' }}>Listed EC2 instances</div>,
    details: (
      <ReactMarkdown className={styles.markdown}>
        {'EC2 Instances IDs:\n * ec2InstanceID1\n * ec2InstanceID2\n * ec2InstanceID3\n * ec2InstanceID4\n'}
      </ReactMarkdown>
    ),
  },
  {
    header: 'Gathering Security Group IDs',
    details: (
      <ReactMarkdown className={styles.markdown}>
        {'Using the ec2_DescribeSecurityGroupsTool:\n* securityGroupID1\n * securityGroupID2\n * securityGroupID3\n'}
      </ReactMarkdown>
    ),
    status: 'loading',
  },
];

export const loadingSteps2: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Listed EC2 instances',
    details: (
      <ReactMarkdown className={styles.markdown}>
        {'EC2 Instances IDs:\n * ec2InstanceID1\n * ec2InstanceID2\n * ec2InstanceID3\n * ec2InstanceID4\n'}
      </ReactMarkdown>
    ),
    status: 'success',
  },
  {
    header: 'Gathered Security Group IDs',
    details: (
      <ReactMarkdown className={styles.markdown}>
        {'Security Groups IDs:\n* securityGroupID1\n * securityGroupID2\n * securityGroupID3\n'}
      </ReactMarkdown>
    ),
    status: 'success',
  },
  {
    header: 'Checking Cross Region Consent',
    status: 'loading',
  },
];

export const loadingSteps3: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Listed EC2 instances',
    details: (
      <ReactMarkdown className={styles.markdown}>
        {'EC2 Instances IDs:\n * ec2InstanceID1\n * ec2InstanceID2\n * ec2InstanceID3\n * ec2InstanceID4\n'}
      </ReactMarkdown>
    ),
    status: 'success',
  },
  {
    header: 'Gathered Security Group IDs',
    details: (
      <ReactMarkdown className={styles.markdown}>
        {'Security Groups IDs:\n* securityGroupID1\n * securityGroupID2\n * securityGroupID3\n'}
      </ReactMarkdown>
    ),
    status: 'success',
  },
  {
    header: 'Checked Cross Region Consent',
    status: 'success',
  },
  {
    header: 'Analyzing security rules',
    status: 'loading',
  },
];

export const successfulSteps: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Listed EC2 instances',
    details: (
      <ReactMarkdown className={styles.markdown}>
        {'EC2 Instances IDs:\n * ec2InstanceID1\n * ec2InstanceID2\n * ec2InstanceID3\n * ec2InstanceID4\n'}
      </ReactMarkdown>
    ),
    status: 'success',
  },
  {
    header: 'Gathered Security Group IDs',
    details: (
      <ReactMarkdown className={styles.markdown}>
        {'Security Groups IDs:\n* securityGroupID1\n * securityGroupID2\n * securityGroupID3\n'}
      </ReactMarkdown>
    ),
    status: 'success',
  },
  {
    header: 'Checked Cross Region Consent',
    status: 'success',
  },
  {
    header: 'Analyzing security rules',
    status: 'success',
  },
];

export const blockedSteps: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Listed EC2 instances',
    details: (
      <ReactMarkdown className={styles.markdown}>
        {'EC2 Instances IDs:\n * ec2InstanceID1\n * ec2InstanceID2\n * ec2InstanceID3\n * ec2InstanceID4\n'}
      </ReactMarkdown>
    ),
    status: 'success',
  },
  {
    header: 'Gathered Security Group IDs',
    details: (
      <ReactMarkdown className={styles.markdown}>
        {'Security Groups IDs:\n* securityGroupID1\n * securityGroupID2\n * securityGroupID3\n'}
      </ReactMarkdown>
    ),
    status: 'success',
  },
  {
    header: 'Need Cross Region Consent',
    details: (
      <ReactMarkdown className={styles.markdown}>
        To answer questions about your account resources, Amazon Q might need to make Cross-Region calls within this AWS
        account.
      </ReactMarkdown>
    ),
    status: 'warning',
  },
];

export const failedSteps: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Listed EC2 instances',
    details: (
      <ReactMarkdown className={styles.markdown}>
        {'EC2 Instances IDs:\n * ec2InstanceID1\n * ec2InstanceID2\n * ec2InstanceID3\n * ec2InstanceID4\n'}
      </ReactMarkdown>
    ),
    status: 'success',
  },
  {
    header: 'Could not fetch security groups',
    status: 'error',
  },
];

export const stepsPermutations = createPermutations<StepsProps>([
  {
    steps: [initialSteps, loadingSteps, loadingSteps2, loadingSteps3, successfulSteps, blockedSteps, failedSteps],
  },
]);

export const initialStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'loading',
    header: <div style={{ margin: '0', color: 'rgb(95, 107, 122)' }}>Listing EC2 instances</div>,
    details: <ReactMarkdown className={styles.markdown}>Using the ec2_DescribeInstances</ReactMarkdown>,
  },
];

export const loadingStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'success',
    header: (
      <div style={{ margin: '0', color: 'rgb(3, 127, 12)' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <ReactMarkdown className={styles.markdown}>
              {'* ec2InstanceID1\n * ec2InstanceID2\n * ec2InstanceID3\n * ec2InstanceID4\n'}
            </ReactMarkdown>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </div>
    ),
  },
  {
    header: <div style={{ margin: '0', color: 'rgb(95, 107, 122)' }}>Gathering Security Group IDs</div>,
    details: (
      <ReactMarkdown className={styles.markdown}>
        {'Using the ec2_DescribeSecurityGroupsTool:\n* securityGroupID1\n * securityGroupID2\n * securityGroupID3\n'}
      </ReactMarkdown>
    ),
    status: 'loading',
  },
];

export const loadingSteps2Interactive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <div style={{ margin: '0', color: 'rgb(3, 127, 12)' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <ReactMarkdown className={styles.markdown}>
              {'* ec2InstanceID1\n * ec2InstanceID2\n * ec2InstanceID3\n * ec2InstanceID4\n'}
            </ReactMarkdown>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </div>
    ),
    status: 'success',
  },
  {
    header: (
      <div style={{ margin: '0', color: 'rgb(3, 127, 12)' }}>
        Gathered Security Group IDs:{' '}
        <Popover
          header={'Security Group IDs'}
          content={
            <ReactMarkdown className={styles.markdown}>
              {'* securityGroupID1\n * securityGroupID2\n * securityGroupID3\n'}
            </ReactMarkdown>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </div>
    ),
    status: 'success',
  },
  {
    header: <div style={{ margin: '0', color: 'rgb(95, 107, 122)' }}>Checking Cross Region Consent</div>,
    status: 'loading',
  },
];

export const loadingSteps3Interactive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <div style={{ margin: '0', color: 'rgb(3, 127, 12)' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <ReactMarkdown className={styles.markdown}>
              {'* ec2InstanceID1\n * ec2InstanceID2\n * ec2InstanceID3\n * ec2InstanceID4\n'}
            </ReactMarkdown>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </div>
    ),
    status: 'success',
  },
  {
    header: (
      <div style={{ margin: '0', color: 'rgb(3, 127, 12)' }}>
        Gathered Security Group IDs:{' '}
        <Popover
          header={'Security Group IDs'}
          content={
            <ReactMarkdown className={styles.markdown}>
              {'* securityGroupID1\n * securityGroupID2\n * securityGroupID3\n'}
            </ReactMarkdown>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </div>
    ),
    status: 'success',
  },
  {
    header: <div style={{ margin: '0', color: 'rgb(3, 127, 12)' }}>Checked Cross Region Consent</div>,
    status: 'success',
  },
  {
    header: <div style={{ margin: '0', color: 'rgb(95, 107, 122)' }}>Analyzing security rules</div>,
    status: 'loading',
  },
];

export const successfulStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <div style={{ margin: '0', color: 'rgb(3, 127, 12)' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <ReactMarkdown className={styles.markdown}>
              {'* ec2InstanceID1\n * ec2InstanceID2\n * ec2InstanceID3\n * ec2InstanceID4\n'}
            </ReactMarkdown>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </div>
    ),
    status: 'success',
  },
  {
    header: (
      <div style={{ margin: '0', color: 'rgb(3, 127, 12)' }}>
        Gathered Security Group IDs:{' '}
        <Popover
          header={'Security Group IDs'}
          content={
            <ReactMarkdown className={styles.markdown}>
              {'* securityGroupID1\n * securityGroupID2\n * securityGroupID3\n'}
            </ReactMarkdown>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </div>
    ),
    status: 'success',
  },
  {
    header: <div style={{ margin: '0', color: 'rgb(3, 127, 12)' }}>Checked Cross Region Consent</div>,
    status: 'success',
  },
  {
    header: <div style={{ margin: '0', color: 'rgb(3, 127, 12)' }}>Analyzing security rules</div>,
    status: 'success',
  },
];

export const blockedStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <div style={{ margin: '0', color: 'rgb(3, 127, 12)' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <ReactMarkdown className={styles.markdown}>
              {'* ec2InstanceID1\n * ec2InstanceID2\n * ec2InstanceID3\n * ec2InstanceID4\n'}
            </ReactMarkdown>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </div>
    ),
    status: 'success',
  },
  {
    header: (
      <div style={{ margin: '0', color: 'rgb(3, 127, 12)' }}>
        Gathered Security Group IDs:{' '}
        <Popover
          header={'Security Group IDs'}
          content={
            <ReactMarkdown className={styles.markdown}>
              {'* securityGroupID1\n * securityGroupID2\n * securityGroupID3\n'}
            </ReactMarkdown>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </div>
    ),
    status: 'success',
  },
  {
    header: <div style={{ margin: '0', color: 'rgb(141, 102, 5)' }}>Need Cross Region Consent</div>,
    details: (
      <ReactMarkdown className={styles.markdown}>
        To answer questions about your account resources, Amazon Q might need to make Cross-Region calls within this AWS
        account.
      </ReactMarkdown>
    ),
    status: 'warning',
  },
];

export const failedStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <div style={{ margin: '0', color: 'rgb(3, 127, 12)' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <ReactMarkdown className={styles.markdown}>
              {'* ec2InstanceID1\n * ec2InstanceID2\n * ec2InstanceID3\n * ec2InstanceID4\n'}
            </ReactMarkdown>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </div>
    ),
    status: 'success',
  },
  {
    header: <div style={{ margin: '0', color: 'rgb(217, 21, 21)' }}>Could not fetch security groups</div>,
    status: 'error',
  },
];

export const failedStepsWithRetryTextInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <div style={{ margin: '0', color: 'rgb(3, 127, 12)' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <ReactMarkdown className={styles.markdown}>
              {'* ec2InstanceID1\n * ec2InstanceID2\n * ec2InstanceID3\n * ec2InstanceID4\n'}
            </ReactMarkdown>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </div>
    ),
    status: 'success',
  },
  {
    header: <div style={{ margin: '0', color: 'rgb(217, 21, 21)' }}>Could not fetch security groups</div>,
    details: (
      <div style={{ margin: '0' }}>
        The request expired due to a server issue. <Link href="#">Retry</Link>
      </div>
    ),
    status: 'error',
  },
];

export const failedStepsWithRetryButtonInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <div style={{ margin: '0', color: 'rgb(3, 127, 12)' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <ReactMarkdown className={styles.markdown}>
              {'* ec2InstanceID1\n * ec2InstanceID2\n * ec2InstanceID3\n * ec2InstanceID4\n'}
            </ReactMarkdown>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </div>
    ),
    status: 'success',
  },
  {
    header: <div style={{ margin: '0', color: 'rgb(217, 21, 21)' }}>Could not fetch security groups</div>,
    details: (
      <>
        <div style={{ margin: '0' }}>The request expired due to a server issue.</div>
        <Button ariaLabel="Retry" iconName="refresh">
          Retry
        </Button>
      </>
    ),
    status: 'error',
  },
];

const changesetStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'success',
    header: (
      <div style={{ margin: '0' }}>
        Create S3 <Link href="#">bucket-12</Link>
      </div>
    ),
  },
  {
    status: 'success',
    header: (
      <div style={{ margin: '0' }}>
        Create CloudWatch <Link href="#">alarm</Link>
      </div>
    ),
  },
  {
    status: 'loading',
    header: (
      <div style={{ margin: '0' }}>
        Update <Link href="#">Lambda-1</Link>
      </div>
    ),
  },
];

export const stepsPermutationsInteractive = createPermutations<StepsProps>([
  {
    steps: [
      initialStepsInteractive,
      loadingStepsInteractive,
      loadingSteps2Interactive,
      loadingSteps3Interactive,
      successfulStepsInteractive,
      blockedStepsInteractive,
      failedStepsInteractive,
      failedStepsWithRetryTextInteractive,
      failedStepsWithRetryButtonInteractive,
      changesetStepsInteractive,
    ],
  },
]);
