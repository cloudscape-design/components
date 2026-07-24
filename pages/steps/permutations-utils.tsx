// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Link from '~components/link';
import Popover from '~components/popover';
import { StepsProps } from '~components/steps';

export const initialSteps: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'loading',
    statusIconAriaLabel: 'loading',
    header: 'Listing EC2 instances',
    details: <Box fontSize="body-s">Using the ec2_DescribeInstances</Box>,
  },
];

export const loadingSteps: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'success',
    statusIconAriaLabel: 'success',
    header: 'Listed EC2 instances',
    details: (
      <Box fontSize="body-s">
        EC2 Instances IDs:
        <ul>
          <li>ec2InstanceID1</li>
          <li>ec2InstanceID2</li>
          <li>ec2InstanceID3</li>
          <li>ec2InstanceID4</li>
        </ul>
      </Box>
    ),
  },
  {
    header: 'Gathering Security Group IDs',
    details: (
      <Box fontSize="body-s">
        Using the ec2_DescribeSecurityGroupsTool:
        <ul>
          <li>securityGroupID1</li>
          <li>securityGroupID2</li>
          <li>securityGroupID3</li>
        </ul>
      </Box>
    ),
    status: 'loading',
    statusIconAriaLabel: 'loading',
  },
];

export const loadingSteps2: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Listed EC2 instances',
    details: (
      <Box fontSize="body-s">
        EC2 Instances IDs:
        <ul>
          <li>ec2InstanceID1</li>
          <li>ec2InstanceID2</li>
          <li>ec2InstanceID3</li>
          <li>ec2InstanceID4</li>
        </ul>
      </Box>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Gathered Security Group IDs and performed multi-stage analysis on each group to ensure no conflicts',
    details: (
      <Box fontSize="body-s">
        Security Groups ID
        <ul>
          <li>securityGroupID1</li>
          <li>securityGroupID2</li>
          <li>securityGroupID3</li>
        </ul>
      </Box>
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
      <Box fontSize="body-s">
        EC2 Instances IDs:
        <ul>
          <li>ec2InstanceID1</li>
          <li>ec2InstanceID2</li>
          <li>ec2InstanceID3</li>
          <li>ec2InstanceID4</li>
        </ul>
      </Box>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Gathered Security Group IDs',
    details: (
      <Box fontSize="body-s">
        Security Groups ID
        <ul>
          <li>securityGroupID1</li>
          <li>securityGroupID2</li>
          <li>securityGroupID3</li>
        </ul>
      </Box>
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
      <Box fontSize="body-s">
        EC2 Instances IDs:
        <ul>
          <li>ec2InstanceID1</li>
          <li>ec2InstanceID2</li>
          <li>ec2InstanceID3</li>
          <li>ec2InstanceID4</li>
        </ul>
      </Box>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Gathered Security Group IDs',
    details: (
      <Box fontSize="body-s">
        Security Groups ID
        <ul>
          <li>securityGroupID1</li>
          <li>securityGroupID2</li>
          <li>securityGroupID3</li>
        </ul>
      </Box>
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
    header: 'Analyzed security rules',
    status: 'success',
    statusIconAriaLabel: 'success',
  },
];

export const blockedSteps: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Listed EC2 instances',
    details: (
      <Box>
        EC2 Instances IDs:
        <ul>
          <li>ec2InstanceID1</li>
          <li>ec2InstanceID2</li>
          <li>ec2InstanceID3</li>
          <li>ec2InstanceID4</li>
        </ul>
      </Box>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Gathered Security Group IDs',
    details: (
      <Box>
        Security Groups ID
        <ul>
          <li>securityGroupID1</li>
          <li>securityGroupID2</li>
          <li>securityGroupID3</li>
        </ul>
      </Box>
    ),
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: 'Need Cross Region Consent',
    details:
      'To answer questions about your account resources, Amazon Q might need to make Cross-Region calls within this AWS account.',
    status: 'warning',
    statusIconAriaLabel: 'warning',
  },
];

export const failedSteps: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Listed EC2 instances',
    details: (
      <Box>
        EC2 Instances IDs:
        <ul>
          <li>ec2InstanceID1</li>
          <li>ec2InstanceID2</li>
          <li>ec2InstanceID3</li>
          <li>ec2InstanceID4</li>
        </ul>
      </Box>
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

export const allStatusesSteps: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'error',
    statusIconAriaLabel: 'error',
    header: 'error step',
    details: 'Test description',
  },
  {
    status: 'warning',
    statusIconAriaLabel: 'warning',
    header: 'warning step',
    details: 'Test description',
  },
  {
    status: 'success',
    statusIconAriaLabel: 'success',
    header: 'success step',
    details: 'Test description',
  },
  {
    status: 'info',
    statusIconAriaLabel: 'info',
    header: 'info step',
    details: 'Test description',
  },
  {
    status: 'stopped',
    statusIconAriaLabel: 'stopped',
    header: 'stopped step',
    details: 'Test description',
  },
  {
    status: 'pending',
    statusIconAriaLabel: 'pending',
    header: 'pending step',
    details: 'Test description',
  },
  {
    status: 'in-progress',
    statusIconAriaLabel: 'in-progress',
    header: 'in-progress step',
    details: 'Test description',
  },
  {
    status: 'loading',
    statusIconAriaLabel: 'loading',
    header: 'loading step',
    details: 'Test description',
  },
  {
    status: 'not-started',
    statusIconAriaLabel: 'not started',
    header: 'not started step',
    details: 'Test description',
  },
  {
    status: 'log',
    statusIconAriaLabel: 'log entry',
    header: 'log step',
    details: 'Test description',
  },
];

export const logSteps: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'log',
    header: 'Request received',
  },
  {
    status: 'log',
    header: 'Request parameters recorded',
    details: 'The request parameters were added to the execution log.',
  },
  {
    status: 'log',
    header: 'Request forwarded',
  },
];

export const timelineSteps: ReadonlyArray<StepsProps.Step> = [
  {
    annotation: <time dateTime="2024-05-01T15:01:23Z">3:01:23 PM</time>,
    status: 'log',
    header: <Link href="#m1">Provided preferences</Link>,
  },
  {
    annotation: <time dateTime="2024-05-01T15:03:10Z">3:03:10 PM</time>,
    status: 'success',
    statusIconAriaLabel: 'Success',
    header: 'Created environment',
  },
  {
    annotation: <time dateTime="2024-05-01T15:04:45Z">3:04:45 PM</time>,
    status: 'error',
    statusIconAriaLabel: 'Error',
    header: 'Validation failed',
    details: 'One or more resources could not be validated.',
  },
];

export const timelineStepsWithVaryingAnnotations: ReadonlyArray<StepsProps.Step> = [
  {
    annotation: <time dateTime="2024-05-01T09:00:00Z">May 05, 2024, 9:00 AM</time>,
    status: 'log',
    header: 'Shorter timestamp',
  },
  {
    annotation: (
      <time dateTime="2024-12-31T23:59:59+14:00" title="December 31, 2024, 11:59:59 PM">
        December 31, 2024, 11:59 PM
      </time>
    ),
    status: 'log',
    header: 'Long timestamp',
  },
  {
    status: 'loading',
    header: 'No annotation yet',
  },
];

export const initialStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'loading',
    statusIconAriaLabel: 'loading',
    header: <span>Listing EC2 instances</span>,
    details: <Box fontSize="body-s">Using the ec2_DescribeInstances</Box>,
  },
];

export const loadingStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'success',
    statusIconAriaLabel: 'success',
    header: (
      <span>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <Box fontSize="body-s">
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </Box>
          }
          position={'bottom'}
        >
          4 items
        </Popover>
      </span>
    ),
  },
  {
    header: <span>Gathering Security Group IDs</span>,
    details: (
      <Box fontSize="body-s">
        Using the ec2_DescribeSecurityGroupsTool:
        <ul>
          <li>securityGroupID1</li>
          <li>securityGroupID2</li>
          <li>securityGroupID3</li>
        </ul>
      </Box>
    ),
    status: 'loading',
    statusIconAriaLabel: 'loading',
  },
];

export const loadingSteps2Interactive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <span>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <Box fontSize="body-s">
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </Box>
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
      <span>
        Gathered Security Group IDs:{' '}
        <Popover
          header={'Security Group IDs'}
          content={
            <Box fontSize="body-s">
              <ul>
                <li>securityGroupID1</li>
                <li>securityGroupID2</li>
                <li>securityGroupID3</li>
              </ul>
            </Box>
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
    header: <span>Checking Cross Region Consent</span>,
    status: 'loading',
    statusIconAriaLabel: 'loading',
  },
];

export const loadingSteps3Interactive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <span>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <Box fontSize="body-s">
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </Box>
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
      <span>
        Gathered Security Group IDs:{' '}
        <Popover
          header={'Security Group IDs'}
          content={
            <Box fontSize="body-s">
              <ul>
                <li>securityGroupID1</li>
                <li>securityGroupID2</li>
                <li>securityGroupID3</li>
              </ul>
            </Box>
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
    header: <span>Checked Cross Region Consent</span>,
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: <span>Analyzing security rules</span>,
    status: 'loading',
    statusIconAriaLabel: 'loading',
  },
];

export const successfulStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <span>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <Box fontSize="body-s">
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </Box>
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
      <span>
        Gathered Security Group IDs:{' '}
        <Popover
          header={'Security Group IDs'}
          content={
            <Box fontSize="body-s">
              <ul>
                <li>securityGroupID1</li>
                <li>securityGroupID2</li>
                <li>securityGroupID3</li>
              </ul>
            </Box>
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
    header: <span>Checked Cross Region Consent</span>,
    status: 'success',
    statusIconAriaLabel: 'success',
  },
  {
    header: <span>Analyzed security rules</span>,
    status: 'success',
    statusIconAriaLabel: 'success',
  },
];

export const blockedStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <span>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <Box fontSize="body-s">
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </Box>
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
      <span>
        Gathered Security Group IDs:{' '}
        <Popover
          header={'Security Group IDs'}
          content={
            <Box fontSize="body-s">
              <ul>
                <li>securityGroupID1</li>
                <li>securityGroupID2</li>
                <li>securityGroupID3</li>
              </ul>
            </Box>
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
    header: <span>Need Cross Region Consent</span>,
    details: (
      <Box fontSize="body-s">
        To answer questions about your account resources, Amazon Q might need to make Cross-Region calls within this AWS
        account.
      </Box>
    ),
    status: 'warning',
    statusIconAriaLabel: 'warning',
  },
];

export const failedStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <span>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <Box fontSize="body-s">
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </Box>
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
    header: <span>Could not fetch security groups</span>,
    status: 'error',
    statusIconAriaLabel: 'error',
  },
];

export const failedStepsWithRetryTextInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <span>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <Box fontSize="body-s">
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </Box>
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
    header: <span>Could not fetch security groups</span>,
    details: (
      <Box fontSize="body-s">
        The request expired due to a server issue. <Link href="#">Retry</Link>
      </Box>
    ),
    status: 'error',
    statusIconAriaLabel: 'error',
  },
];

export const failedStepsWithRetryButtonInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    header: (
      <span>
        Listed EC2 instances:{' '}
        <Popover
          header={'EC2 Instance IDs'}
          content={
            <Box fontSize="body-s">
              <ul>
                <li>ec2InstanceID1</li>
                <li>ec2InstanceID2</li>
                <li>ec2InstanceID3</li>
                <li>ec2InstanceID4</li>
              </ul>
            </Box>
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
    header: <span>Could not fetch security groups</span>,
    details: (
      <>
        <Box fontSize="body-s">The request expired due to a server issue.</Box>
        <Button ariaLabel="Retry" iconName="refresh">
          Retry
        </Button>
      </>
    ),
    status: 'error',
    statusIconAriaLabel: 'error',
  },
];

export const changesetStepsInteractive: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'success',
    statusIconAriaLabel: 'success',
    header: (
      <span>
        Create S3 <Link href="#">bucket-12</Link>
      </span>
    ),
  },
  {
    status: 'success',
    statusIconAriaLabel: 'success',
    header: (
      <span>
        Create CloudWatch <Link href="#">alarm</Link>
      </span>
    ),
  },
  {
    status: 'loading',
    statusIconAriaLabel: 'loading',
    header: (
      <span>
        Update <Link href="#">Lambda-1</Link>
      </span>
    ),
  },
];
