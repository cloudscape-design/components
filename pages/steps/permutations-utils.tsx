// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Link from '~components/link';
import Popover from '~components/popover';
import { StepsProps } from '~components/steps';

import createPermutations from '../utils/permutations';

const initialSteps: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'loading',
    statusIconAriaLabel: 'loading',
    header: 'Listing EC2 instances',
    details: <span style={{ marginBlock: 0, fontSize: '12px' }}>Using the ec2_DescribeInstances</span>,
  },
];

const loadingSteps: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'success',
    statusIconAriaLabel: 'success',
    header: <span style={{ margin: '0' }}>Listed EC2 instances</span>,
    details: (
      <span style={{ marginBlock: 0, fontSize: '12px' }}>
        EC2 Instances IDs:
        <ul>
          <li>ec2InstanceID1</li>
          <li>ec2InstanceID2</li>
          <li>ec2InstanceID3</li>
          <li>ec2InstanceID4</li>
        </ul>
      </span>
    ),
  },
  {
    header: 'Gathering Security Group IDs',
    details: (
      <span style={{ marginBlock: 0, fontSize: '12px' }}>
        Using the ec2_DescribeSecurityGroupsTool:
        <ul>
          <li>securityGroupID1</li>
          <li>securityGroupID2</li>
          <li>securityGroupID3</li>
        </ul>
      </span>
    ),
    status: 'loading',
    statusIconAriaLabel: 'loading',
  },
];

export const loadingSteps2: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Listed EC2 instances',
    details: (
      <span style={{ marginBlock: 0, fontSize: '12px' }}>
        EC2 Instances IDs:
        <ul>
          <li>ec2InstanceID1</li>
          <li>ec2InstanceID2</li>
          <li>ec2InstanceID3</li>
          <li>ec2InstanceID4</li>
        </ul>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Gathered Security Group IDs',
    details: (
      <span style={{ marginBlock: 0, fontSize: '12px' }}>
        Security Groups ID
        <ul>
          <li>securityGroupID1</li>
          <li>securityGroupID2</li>
          <li>securityGroupID3</li>
        </ul>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Checking Cross Region Consent',
    status: 'loading',
    statusIconAriaLabel: 'loading',
  },
];

export const loadingSteps3: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Listed EC2 instances',
    details: (
      <span style={{ marginBlock: 0, fontSize: '12px' }}>
        EC2 Instances IDs:
        <ul>
          <li>ec2InstanceID1</li>
          <li>ec2InstanceID2</li>
          <li>ec2InstanceID3</li>
          <li>ec2InstanceID4</li>
        </ul>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Gathered Security Group IDs',
    details: (
      <span style={{ marginBlock: 0, fontSize: '12px' }}>
        Security Groups ID
        <ul>
          <li>securityGroupID1</li>
          <li>securityGroupID2</li>
          <li>securityGroupID3</li>
        </ul>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Checked Cross Region Consent',
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Analyzing security rules',
    status: 'loading',
    statusIconAriaLabel: 'loading',
  },
];

export const successfulSteps: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Listed EC2 instances',
    details: (
      <span style={{ marginBlock: 0, fontSize: '12px' }}>
        EC2 Instances IDs:
        <ul>
          <li>ec2InstanceID1</li>
          <li>ec2InstanceID2</li>
          <li>ec2InstanceID3</li>
          <li>ec2InstanceID4</li>
        </ul>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Gathered Security Group IDs',
    details: (
      <span style={{ marginBlock: 0, fontSize: '12px' }}>
        Security Groups ID
        <ul>
          <li>securityGroupID1</li>
          <li>securityGroupID2</li>
          <li>securityGroupID3</li>
        </ul>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Checked Cross Region Consent',
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Analyzing security rules',
    status: 'success',
    statusIconAriaLabel: 'success',
  },
];

export const blockedSteps: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Listed EC2 instances',
    details: (
      <span style={{ marginBlock: 0, fontSize: '12px' }}>
        EC2 Instances IDs:
        <ul>
          <li>ec2InstanceID1</li>
          <li>ec2InstanceID2</li>
          <li>ec2InstanceID3</li>
          <li>ec2InstanceID4</li>
        </ul>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Gathered Security Group IDs',
    details: (
      <span style={{ marginBlock: 0, fontSize: '12px' }}>
        Security Groups ID
        <ul>
          <li>securityGroupID1</li>
          <li>securityGroupID2</li>
          <li>securityGroupID3</li>
        </ul>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Need Cross Region Consent',
    details: (
      <span style={{ marginBlock: 0, fontSize: '12px' }}>
        To answer questions about your account resources, Amazon Q might need to make Cross-Region calls within this AWS
        account.
      </span>
    ),
    status: 'warning',
    statusIconAriaLabel: 'warning',
  },
];

export const failedSteps: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Listed EC2 instances',
    details: (
      <span style={{ marginBlock: 0, fontSize: '12px' }}>
        EC2 Instances IDs:
        <ul>
          <li>ec2InstanceID1</li>
          <li>ec2InstanceID2</li>
          <li>ec2InstanceID3</li>
          <li>ec2InstanceID4</li>
        </ul>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Could not fetch security groups',
    status: 'error',
    statusIconAriaLabel: 'error',
  },
];

export const stepsPermutations = createPermutations<StepsProps>([
  {
    steps: [initialSteps, loadingSteps, loadingSteps2, loadingSteps3, successfulSteps, blockedSteps, failedSteps],
    ariaLabel: ['test label'],
  },
]);

export const initialStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'loading',
    statusIconAriaLabel: 'loading',
    header: <span style={{ margin: '0' }}>Listing EC2 instances</span>,
    details: <span style={{ marginBlock: 0, fontSize: '12px' }}>Using the ec2_DescribeInstances</span>,
  },
];

export const loadingStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'success',
    statusIconAriaLabel: 'success',
    header: (
      <span style={{ margin: '0' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <span style={{ marginBlock: 0, fontSize: '12px' }}>
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </span>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </span>
    ),
  },
  {
    header: <span style={{ margin: '0' }}>Gathering Security Group IDs</span>,
    details: (
      <span style={{ marginBlock: 0, fontSize: '12px' }}>
        Using the ec2_DescribeSecurityGroupsTool:
        <ul>
          <li>securityGroupID1</li>
          <li>securityGroupID2</li>
          <li>securityGroupID3</li>
        </ul>
      </span>
    ),
    status: 'loading',
    statusIconAriaLabel: 'loading',
  },
];

export const loadingSteps2Interactive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <span style={{ margin: '0' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <span style={{ marginBlock: 0, fontSize: '12px' }}>
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </span>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: (
      <span style={{ margin: '0' }}>
        Gathered Security Group IDs:{' '}
        <Popover
          header={'Security Group IDs'}
          content={
            <span style={{ marginBlock: 0, fontSize: '12px' }}>
              <ul>
                <li>securityGroupID1</li>
                <li>securityGroupID2</li>
                <li>securityGroupID3</li>
              </ul>
            </span>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: <span style={{ margin: '0' }}>Checking Cross Region Consent</span>,
    status: 'loading',
    statusIconAriaLabel: 'loading',
  },
];

export const loadingSteps3Interactive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <span style={{ margin: '0' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <span style={{ marginBlock: 0, fontSize: '12px' }}>
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </span>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: (
      <span style={{ margin: '0' }}>
        Gathered Security Group IDs:{' '}
        <Popover
          header={'Security Group IDs'}
          content={
            <span style={{ marginBlock: 0, fontSize: '12px' }}>
              <ul>
                <li>securityGroupID1</li>
                <li>securityGroupID2</li>
                <li>securityGroupID3</li>
              </ul>
            </span>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: <span style={{ margin: '0' }}>Checked Cross Region Consent</span>,
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: <span style={{ margin: '0' }}>Analyzing security rules</span>,
    status: 'loading',
    statusIconAriaLabel: 'loading',
  },
];

export const successfulStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <span style={{ margin: '0' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <span style={{ marginBlock: 0, fontSize: '12px' }}>
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </span>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: (
      <span style={{ margin: '0' }}>
        Gathered Security Group IDs:{' '}
        <Popover
          header={'Security Group IDs'}
          content={
            <span style={{ marginBlock: 0, fontSize: '12px' }}>
              <ul>
                <li>securityGroupID1</li>
                <li>securityGroupID2</li>
                <li>securityGroupID3</li>
              </ul>
            </span>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: <span style={{ margin: '0' }}>Checked Cross Region Consent</span>,
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: <span style={{ margin: '0' }}>Analyzing security rules</span>,
    status: 'success',
    statusIconAriaLabel: 'success',
  },
];

export const blockedStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <span style={{ margin: '0' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <span style={{ marginBlock: 0, fontSize: '12px' }}>
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </span>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: (
      <span style={{ margin: '0' }}>
        Gathered Security Group IDs:{' '}
        <Popover
          header={'Security Group IDs'}
          content={
            <span style={{ marginBlock: 0, fontSize: '12px' }}>
              <ul>
                <li>securityGroupID1</li>
                <li>securityGroupID2</li>
                <li>securityGroupID3</li>
              </ul>
            </span>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: <span style={{ margin: '0' }}>Need Cross Region Consent</span>,
    details: (
      <span style={{ marginBlock: 0, fontSize: '12px' }}>
        To answer questions about your account resources, Amazon Q might need to make Cross-Region calls within this AWS
        account.
      </span>
    ),
    status: 'warning',
    statusIconAriaLabel: 'warning',
  },
];

export const failedStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <span style={{ margin: '0' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <span style={{ marginBlock: 0, fontSize: '12px' }}>
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </span>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: <span style={{ margin: '0' }}>Could not fetch security groups</span>,
    status: 'error',
    statusIconAriaLabel: 'error',
  },
];

export const failedStepsWithRetryTextInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <span style={{ margin: '0' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <span style={{ marginBlock: 0, fontSize: '12px' }}>
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </span>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: <span style={{ margin: '0' }}>Could not fetch security groups</span>,
    details: (
      <span style={{ margin: '0' }}>
        The request expired due to a server issue. <Link href="#">Retry</Link>
      </span>
    ),
    status: 'error',
    statusIconAriaLabel: 'error',
  },
];

export const failedStepsWithRetryButtonInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <span style={{ margin: '0' }}>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <span style={{ marginBlock: 0, fontSize: '12px' }}>
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </span>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </span>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: <span style={{ margin: '0' }}>Could not fetch security groups</span>,
    details: (
      <>
        <span style={{ margin: '0' }}>The request expired due to a server issue.</span>
        <Button ariaLabel="Retry" iconName="refresh">
          Retry
        </Button>
      </>
    ),
    status: 'error',
    statusIconAriaLabel: 'error',
  },
];

const changesetStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'success',
    statusIconAriaLabel: 'success',
    header: (
      <span style={{ margin: '0' }}>
        Create S3 <Link href="#">bucket-12</Link>
      </span>
    ),
  },
  {
    status: 'success',
    statusIconAriaLabel: 'success',
    header: (
      <span style={{ margin: '0' }}>
        Create CloudWatch <Link href="#">alarm</Link>
      </span>
    ),
  },
  {
    status: 'loading',
    statusIconAriaLabel: 'loading',
    header: (
      <span style={{ margin: '0' }}>
        Update <Link href="#">Lambda-1</Link>
      </span>
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
