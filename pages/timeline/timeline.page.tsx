// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { add as addTime, format } from 'date-fns';

import {
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Header,
  Link,
  Modal,
  RadioGroup,
  SelectProps,
  StatusIndicator,
  Timeline,
} from '~components';
import { TimelineProps } from '~components/timeline/interfaces';

// import CustomSvg from "./assets/alarm-ringing.svg";
import styles from './styles.scss';

const i18nStrings: TimelineProps.I18nStrings = {
  stepNumberLabel: (stepNumber: number) => `Timeline Step ${stepNumber}`,
};

// import styles from './styles.scss';

const variantOptions: Array<SelectProps.Option> = [
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' },
];

const metadata = {
  ecdNumber: 'CYB-2023-001',
  projectName: 'Enterprise Security Monitoring System',
  ecdTitle: 'Upgrade to Latest Vulnerability Scanning Software',
  submittedBy: 'John Doe',
  submittedOn: '2023-04-15',
  ecdDescription:
    "This ECD proposes upgrading the vulnerability scanning software used in the Enterprise Security Monitoring System to the latest version. The current version is outdated and lacks support for the latest vulnerabilities and attack vectors. The upgrade will enhance the system's ability to detect and respond to emerging threats.",
  impactAnalysis: {
    affectedComponents: ['Vulnerability Scanning Module', 'Reporting Dashboard'],
    potentialRisks: ['Compatibility issues with existing integrations', 'Temporary service disruption during upgrade'],
    mitigationPlan:
      'Conduct thorough testing in a non-production environment. Implement a phased rollout to minimize service disruption. Coordinate with stakeholders for proper planning and communication.',
  },
  approvalProcess: {
    approvalStages: [
      {
        stage: 'Technical Review',
        approver: 'Jane Smith',
        approvalDate: '2023-04-20',
        comments:
          'The proposed upgrade aligns with our security best practices and addresses critical vulnerabilities.',
      },
      {
        stage: 'Change Advisory Board',
        approver: 'Michael Johnson',
        approvalDate: '2023-04-25',
        comments: 'Approved with the condition of implementing the recommended mitigation plan.',
      },
      {
        stage: 'Executive Approval',
        approver: 'Sarah Lee',
        approvalDate: '2023-04-28',
        comments: 'Approved. Ensure proper communication and coordination with stakeholders.',
      },
    ],
  },
  implementation: {
    plannedStartDate: '2023-05-01',
    plannedCompletionDate: '2023-05-15',
    assignedTeam: ['Security Operations', 'Infrastructure Engineering'],
    postImplementationReview:
      'A post-implementation review will be conducted within 30 days to assess the effectiveness of the upgrade and identify any areas for improvement.',
  },
};

export default function TimelinePage() {
  const [direction, setDirection] = useState('vertical');
  const [nested, setIsNested] = useState(false);
  const [visible, setVisible] = useState(false);

  const dateFormat = 'MMM do yyyy HH:mm:ss';

  const steps: TimelineProps.Step[] = [
    {
      title: 'ECO requested',
      completed: true,
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
              <div className={styles['time-text']}>
                {format(addTime(new Date(), { days: -1, hours: 3 }), dateFormat)}
              </div>
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
          action: (
            <Button variant="inline-link" onClick={() => setVisible(true)}>
              Show modal
            </Button>
          ),
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

  return (
    <Box margin="xl">
      <RadioGroup
        value={direction}
        onChange={event => setDirection(event.detail.value)}
        ariaControls="language-settings"
        items={variantOptions as any}
      />
      <br />
      <Checkbox
        id="nested"
        disabled={direction === 'horizontal'}
        onChange={event => setIsNested(event.detail.checked)}
        checked={direction === 'vertical' && nested}
      >
        Show nested
      </Checkbox>
      <br />
      <Container>
        <Timeline
          id="timeline"
          direction={direction}
          steps={steps}
          i18nStrings={i18nStrings}
          variant={nested && direction === 'vertical' ? 'nested' : 'not-nested'}
        />
      </Container>
      <Modal header="Step info" visible={visible} onDismiss={() => setVisible(false)} closeAriaLabel="Close modal">
        <Container
          header={
            <Header variant="h3" headingTagOverride="h4">
              ECD Approval Added to Queue
            </Header>
          }
        >
          <div className={styles['time-text']}>{format(addTime(new Date(), { days: -20 }), dateFormat)}</div>
          <br />
          <pre style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{JSON.stringify(metadata, undefined, 2)}</pre>
        </Container>
      </Modal>
    </Box>
  );
}
