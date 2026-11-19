// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '~components/badge';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Input from '~components/input';
import Link from '~components/link';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import TopNavigation, { TopNavigationProps } from '~components/top-navigation';

import { SimplePage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import logo from './logos/simple-logo.svg';

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  paddingInline: 16,
  minHeight: 48,
  gap: 16,
};

const trailingStyle: React.CSSProperties = {
  marginInlineStart: 'auto',
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 8,
};

const Brand = ({ title }: { title: string }) => (
  <>
    <img src={logo} alt={title} style={{ height: 24 }} />
    <span style={{ fontWeight: 700 }}>{title}</span>
  </>
);

function useCustomContents(): Record<string, React.ReactNode> {
  const [searchValue, setSearchValue] = useState('');
  const [environment, setEnvironment] = useState<{ value: string; label: string } | null>({
    value: 'prod',
    label: 'Production',
  });

  return {
    'Badge, status indicator and buttons': (
      <div style={navStyle}>
        <Brand title="My Service" />
        <div style={trailingStyle}>
          <StatusIndicator type="success">Operational</StatusIndicator>
          <Badge color="blue">3 updates</Badge>
          <Button variant="link" href="#">
            Docs
          </Button>
          <Button variant="primary">Sign in</Button>
        </div>
      </div>
    ),
    'Button dropdown variants': (
      <div style={navStyle}>
        <Brand title="My Service" />
        <div style={trailingStyle}>
          <ButtonDropdown
            items={[
              { id: 'us-east-1', text: 'US East (N. Virginia)' },
              { id: 'us-west-2', text: 'US West (Oregon)' },
              { id: 'eu-west-1', text: 'Europe (Ireland)' },
            ]}
          >
            Region
          </ButtonDropdown>
          <ButtonDropdown
            expandableGroups={true}
            items={[
              {
                id: 'docs-group',
                text: 'Documentation',
                items: [
                  { id: 'api', text: 'API reference', href: '#', external: true },
                  { id: 'guides', text: 'Developer guides', href: '#', external: true },
                ],
              },
              {
                id: 'support-group',
                text: 'Support',
                items: [
                  { id: 'contact', text: 'Contact us' },
                  { id: 'feedback', text: 'Send feedback' },
                ],
              },
            ]}
          >
            Help
          </ButtonDropdown>
          <ButtonDropdown
            variant="primary"
            items={[
              { id: 'instance', text: 'Launch instance', iconName: 'add-plus' },
              { id: 'volume', text: 'Create volume', iconName: 'add-plus' },
            ]}
          >
            Create
          </ButtonDropdown>
        </div>
      </div>
    ),
    'Select and button': (
      <div style={navStyle}>
        <Brand title="My Service" />
        <div style={trailingStyle}>
          <Select
            selectedOption={environment}
            onChange={({ detail }) => setEnvironment(detail.selectedOption as { value: string; label: string })}
            options={[
              { value: 'prod', label: 'Production' },
              { value: 'dev', label: 'Development' },
            ]}
            ariaLabel="Environment selector"
          />
          <Button variant="primary" iconName="add-plus">
            Create
          </Button>
        </div>
      </div>
    ),
    Cloudscape: (
      <div style={navStyle}>
        <Button variant="icon" iconName="menu" ariaLabel="Open navigation" />
        <Brand title="Cloudscape" />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Link href="#">Get started</Link>
          <Link href="#">Foundation</Link>
          <Link href="#">Components</Link>
          <Link href="#">Patterns</Link>
          <Link href="#">Demos</Link>
        </div>
        <div style={trailingStyle}>
          <Input
            type="search"
            placeholder="Search"
            value={searchValue}
            onChange={({ detail }) => setSearchValue(detail.value)}
            ariaLabel="Search"
          />
          <Button variant="icon" iconName="light-dark" ariaLabel="Theme" />
        </div>
      </div>
    ),
    'Taller top navigation': (
      <div style={{ ...navStyle, minHeight: 72 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={logo} alt="My Service" style={{ height: 32 }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>My Service</span>
            <span style={{ fontSize: 12, opacity: 0.7 }}>Production workspace</span>
          </div>
        </div>
        <div style={{ flex: 1, maxWidth: 480, marginInline: 'auto' }}>
          <Input
            type="search"
            placeholder="Search resources, docs, and settings..."
            value={searchValue}
            onChange={({ detail }) => setSearchValue(detail.value)}
            ariaLabel="Search"
          />
        </div>
        <div style={trailingStyle}>
          <StatusIndicator type="success">Connected</StatusIndicator>
          <ButtonDropdown
            variant="icon"
            ariaLabel="Account menu"
            items={[
              { id: 'profile', text: 'Your profile' },
              { id: 'settings', text: 'Settings' },
              { id: 'signout', text: 'Sign out' },
            ]}
          >
            Jane Doe
          </ButtonDropdown>
        </div>
      </div>
    ),
    'Centered brand with navigation and auth actions': (
      <div style={navStyle}>
        <div style={{ flex: 1 }}>
          <SpaceBetween direction="horizontal" size="m" alignItems="center">
            <Link href="#">Download</Link>
            <Link href="#">Pricing</Link>
            <Link href="#">Help center</Link>
          </SpaceBetween>
        </div>
        <Brand title="Steep" />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <SpaceBetween direction="horizontal" size="xs" alignItems="center">
            <Link href="#">Request a demo</Link>
            <Button variant="link" href="#">
              Log in
            </Button>
            <Button variant="primary">Get started</Button>
          </SpaceBetween>
        </div>
      </div>
    ),
  };
}

interface Permutation {
  visualContext: TopNavigationProps['visualContext'];
  label: string;
}

export default function CustomContentPermutationsPage() {
  const customContents = useCustomContents();

  const permutations = createPermutations<Permutation>([
    {
      visualContext: ['top-navigation', 'none'],
      label: Object.keys(customContents),
    },
  ]);

  return (
    <SimplePage title="TopNavigation customContent permutations" screenshotArea={{}}>
      <PermutationsView
        permutations={permutations}
        render={({ visualContext, label }) => (
          <div style={{ marginBottom: 16 }}>
            <h2>
              visualContext=&quot;{visualContext}&quot; — {label}
            </h2>
            <TopNavigation visualContext={visualContext}>{customContents[label]}</TopNavigation>
          </div>
        )}
      />
    </SimplePage>
  );
}
