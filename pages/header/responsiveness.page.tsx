// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable react/jsx-key */
import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';
import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Container from '~components/container';
import Header, { HeaderProps } from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './styles.scss';
import { Toggle } from '~components';

type Approach = 'current' | 'grid' | 'flex' | 'cquery' | 'resize-observer' | 'scott';

type DemoHeaderProps = Pick<HeaderProps, 'children' | 'actions' | 'description' | 'info'>;

function ToggleButton() {
  const [status, setStatus] = useState(false);
  return <Button onClick={() => setStatus(!status)}>{status ? 'Small' : 'Very large for no reason'}</Button>;
}

const permutations: Array<Partial<HeaderProps>> = [
  {
    children: 'Simple container header',
    description: (
      <span>
        Fairly short description for this container. Not much to see here except for{' '}
        <Link href="#" variant="secondary">
          a link
        </Link>
        .
      </span>
    ),
    actions: <Button>One action</Button>,
  },
  {
    children: 'Tags (4)',
    info: <Link variant="info">Info</Link>,
    description:
      'A tag is a label that you assign to an AWS resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your AWS costs.',
    actions: <Button>Manage tags</Button>,
  },
  {
    children: 'Snapshots',
    description: 'Select at least one snapshot to perform an action.',
    actions: (
      <SpaceBetween direction="horizontal" size="xs">
        <Button iconName="refresh" ariaLabel="Refresh snapshots" />
        <ButtonDropdown items={[]}>Actions</ButtonDropdown>
        <Button variant="primary">Create snapshot</Button>
      </SpaceBetween>
    ),
  },
  {
    children: 'Workgroups',
    description:
      'Use workgroups to separate users, teams, applications, workloads, and to set limits on amount of data for each query or the entire workgroup process. You can also view query-related metrics in AWS CloudWatch.',
    actions: (
      <SpaceBetween direction="horizontal" size="xs">
        <ButtonDropdown items={[]}>Actions</ButtonDropdown>
        <Button variant="primary">Create workgroup</Button>
      </SpaceBetween>
    ),
  },
  {
    children: 'Access Points (100)',
    info: <Link variant="info">Info</Link>,
    description: (
      <span>
        Amazon S3 Access Points simplify managing data access at scale for shared datasets in S3. Access points are
        named network endpoints that are attached to buckets that you can use to perform S3 object operations. An Access
        Point alias provides the same functionality as an Access Point ARN and can be substituted for use anywhere an S3
        bucket name is normally used for data access.{' '}
        <Link href="#" variant="secondary" external={true} ariaLabel="Learn more about access points">
          Learn more
        </Link>
      </span>
    ),
    actions: (
      <SpaceBetween direction="horizontal" size="xs">
        <Button iconName="copy">Copy Access Point alias</Button>
        <Button iconName="copy">Copy ARN</Button>
        <Button>Edit policy</Button>
        <ToggleButton />
        <Button variant="primary">Create access point</Button>
      </SpaceBetween>
    ),
  },
  {
    children: 'Capacity reservations for the US East (South America São Paulo) Region',
    info: <Link variant="info">Info</Link>,
    description: (
      <span>
        Amazon S3 Access Points simplify managing data access at scale for shared datasets in S3. Access points are
        named network endpoints that are attached to buckets that you can use to perform S3 object operations.
      </span>
    ),
    actions: (
      <SpaceBetween direction="horizontal" size="xs">
        <Button iconName="copy">Copy ARN</Button>
        <Button>Edit policy</Button>
      </SpaceBetween>
    ),
  },
];

function HeaderGrid({ children, actions, description }: DemoHeaderProps) {
  return (
    <div className={styles['header-grid']}>
      <SpaceBetween direction="horizontal" size="xs" className={styles['header-grid--title']}>
        <Box variant="h2">{children}</Box>
      </SpaceBetween>
      <Box variant="p" color="text-body-secondary" className={styles['header-grid--description']}>
        {description}
      </Box>
      <div className={styles['header-grid--actions']}>{actions}</div>
    </div>
  );
}

function HeaderFlex({ children, actions, description }: DemoHeaderProps) {
  return (
    <div className={styles['header-flex']}>
      <div className={styles['header-flex--heading']}>
        <SpaceBetween direction="horizontal" size="xs" className={styles['header-flex--title']}>
          <Box variant="h2">{children}</Box>
        </SpaceBetween>
        <Box variant="p" color="text-body-secondary" className={styles['header-flex--description']}>
          {description}
        </Box>
      </div>
      <div className={styles['header-flex--actions']}>{actions}</div>
    </div>
  );
}

function HeaderContainerQuery({ children, actions, description }: DemoHeaderProps) {
  return (
    <div className={styles['header-cquery-wrapper']}>
      <div className={styles['header-cquery']}>
        <Box variant="h2" className={styles['header-cquery--title']}>
          {children}
        </Box>
        <Box variant="p" color="text-body-secondary" className={styles['header-cquery--description']}>
          {description}
        </Box>
        <div className={styles['header-cquery--actions']}>{actions}</div>
      </div>
    </div>
  );
}

function HeaderScott({ children, actions, description }: DemoHeaderProps) {
  return (
    <div className={styles.scott}>
      <div className={styles['scott-container']}>
        <SpaceBetween direction="horizontal" size="xs" className={styles['scott-title']}>
          <Box variant="h2">{children}</Box>
        </SpaceBetween>
        <Box variant="p" color="text-body-secondary" className={styles['scott-description']}>
          {description}
        </Box>
        <div className={styles['scott-actions']}>{actions}</div>
      </div>
    </div>
  );
}

function HeaderResizeObserver({ children, actions, description }: DemoHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [wrapActions, setWrapActions] = useState(false);

  const updateLayout = () => {
    if (!containerRef.current || !actionsRef.current) {
      return;
    }
    const container = containerRef.current;
    const actions = actionsRef.current;
    const title = container.querySelector(`.${styles['header-grid--title']}`)!;

    // const oldRect = actions.getBoundingClientRect();
    actions.style.width = 'max-content';
    const intrinsicRect = actions.getBoundingClientRect();
    actions.style.width = '';

    const containerRect = container.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();

    // console.log({ containerWidth: containerRect.width, titleWidth: titleRect.width, actionsWidth: oldRect.width });

    const distance = containerRect.width - (titleRect.width + intrinsicRect.width);
    // console.log({ distance });
    setWrapActions(distance < 50);
  };

  useResizeObserver(containerRef, () => {
    updateLayout();
  });
  useResizeObserver(actionsRef, () => {
    updateLayout();
  });
  return (
    <div className={clsx(styles['header-grid'], wrapActions && styles['header-grid--overlap'])} ref={containerRef}>
      <SpaceBetween direction="horizontal" size="xs" className={styles['header-grid--title']}>
        <Box variant="h2">{children}</Box>
      </SpaceBetween>
      <Box variant="p" color="text-body-secondary" className={styles['header-grid--description']}>
        {description}
      </Box>
      <div className={styles['header-grid--actions']} ref={actionsRef}>
        {actions}
      </div>
    </div>
  );
}

function renderHeader(approach: Approach, props: Partial<HeaderProps>) {
  switch (approach) {
    case 'grid':
      return <HeaderGrid {...props} />;
    case 'flex':
      return <HeaderFlex {...props} />;
    case 'cquery':
      return <HeaderContainerQuery {...props} />;
    case 'resize-observer':
      return <HeaderResizeObserver {...props} />;
    case 'scott':
      return <HeaderScott {...props} />;
    case 'current':
    default:
      return <Header {...props} />;
  }
}

const approachDescription: Record<Approach, string> = {
  current: 'Current implementation',
  grid: 'CSS Grid that places actions in the top right',
  flex: 'Similar to current approach but with different flows',
  cquery: 'Like grid, but rearranges actions when container is small',
  'resize-observer': 'not working',
  scott: '',
};

export function Showcase({ approach }: { approach: Approach }) {
  return (
    <div className={styles.showcase}>
      <div>
        <h2>Approach: {approach}</h2>
        <p>{approachDescription[approach]}</p>
      </div>

      {permutations.map((props, i) => {
        return (
          <Container key={i} header={renderHeader(approach, props)}>
            Container content
          </Container>
        );
      })}
    </div>
  );
}

export default function PageHeadersDemo() {
  const [subgrid, setSubgrid] = useState(false);
  return (
    <ScreenshotArea>
      <Box padding="l">
        <Toggle checked={subgrid} onChange={({ detail }) => setSubgrid(detail.checked)}>
          Side by side
        </Toggle>
        <div className={clsx(styles.playground, subgrid && styles['playground--side-by-side'])}>
          <Showcase approach="current" />
          <Showcase approach="resize-observer" />
          {/* <Showcase approach="grid" /> */}
          {/* <Showcase approach="cquery" /> */}
          <Showcase approach="flex" />
          {/* <Showcase approach="scott" /> */}
        </div>
      </Box>
    </ScreenshotArea>
  );
}
