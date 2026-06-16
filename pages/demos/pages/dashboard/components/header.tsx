// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import HelpPanel from '@cloudscape-design/components/help-panel';

import { ExternalLinkGroup, InfoLink, useHelpPanel } from '../../commons';

export function DashboardMainInfo() {
  return (
    <HelpPanel
      header={<h2>Service</h2>}
      footer={
        <ExternalLinkGroup
          items={[
            { href: '#', text: 'User Guide for Linux Instances' },
            { href: '#', text: 'User Guide for Windows Instances' },
            { href: '#', text: 'API Reference' },
            { href: '#', text: 'EC2 section of the AWS CLI Reference' },
            { href: '#', text: 'EC2 Instance Connect API Reference' },
          ]}
        />
      }
    >
      <p>
        Amazon Elastic Compute Cloud (Amazon EC2) is a web service that provides resizeable computing
        capacity&mdash;literally, servers in Amazon's data centers&mdash;that you use to build and host your software
        systems.
      </p>
    </HelpPanel>
  );
}

export function DashboardHeader({ actions }: { actions: React.ReactNode }) {
  const loadHelpPanelContent = useHelpPanel();
  return (
    <Header
      variant="h1"
      info={<InfoLink onFollow={() => loadHelpPanelContent(<DashboardMainInfo />)} />}
      actions={actions}
    >
      Service Dashboard
    </Header>
  );
}
