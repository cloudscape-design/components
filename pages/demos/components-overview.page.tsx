// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BreadcrumbGroup, Header, SpaceBetween } from '@cloudscape-design/components';

import { Notifications } from './pages/commons';
import { CustomAppLayout } from './pages/commons/common-components';
import ButtonsInputsDropdowns from './pages/components-overview/buttons-inputs-dropdowns';
import Charts from './pages/components-overview/charts';
import Chat from './pages/components-overview/chat';
import FormControls from './pages/components-overview/form-controls';
import Images from './pages/components-overview/images';
import KvpForm from './pages/components-overview/kvp-form';
import NavigationComponents from './pages/components-overview/navigation-components';
import OverlaysAndPatterns from './pages/components-overview/overlays-and-patterns';
import StatusComponents from './pages/components-overview/status-components';
import TableAndCards from './pages/components-overview/table-and-cards';
import Typography from './pages/components-overview/typography';

import './styles/base.scss';

export default function Page() {
  return (
    <CustomAppLayout
      toolsHide={true}
      navigationHide={true}
      contentType="wizard"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Home', href: '#/' },
            { text: 'Design details', href: '#/' },
            { text: 'Components overview', href: '#/components-overview' },
          ]}
        />
      }
      notifications={<Notifications />}
      content={
        <SpaceBetween direction="vertical" size="xl">
          <Header
            variant="h1"
            description="A representative subset of Cloudscape components for demonstration purposes."
          >
            Components overview page
          </Header>
          <div id="typography">
            <Typography />
          </div>
          <div id="buttons-inputs-dropdowns">
            <ButtonsInputsDropdowns />
          </div>
          <div id="form-controls">
            <FormControls />
          </div>
          <div id="navigation-components">
            <NavigationComponents />
          </div>
          <div id="table-and-cards">
            <TableAndCards />
          </div>
          <div id="charts">
            <Charts />
          </div>
          <div id="overlays-and-patterns">
            <OverlaysAndPatterns />
          </div>
          <div id="chat">
            <Chat />
          </div>
          <div id="status-components">
            <StatusComponents />
          </div>
          <div id="images">
            <Images />
          </div>
          <div id="kvp-form">
            <KvpForm />
          </div>
        </SpaceBetween>
      }
    />
  );
}
