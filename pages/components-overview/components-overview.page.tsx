// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import SpaceBetween from '~components/space-between';

import BoardSection from './board-section';
import ButtonsInputsDropdowns from './buttons-inputs-dropdowns';
import Charts from './charts';
import Chat from './chat';
import CodeViewSection from './code-view-section';
import FormControls from './form-controls';
import KvpForm from './kvp-form';
import NavigationComponents from './navigation-components';
import OverlaysAndPatterns from './overlays-and-patterns';
import StatusComponents from './status-components';
import TableAndCards from './table-and-cards';
import Typography from './typography';

export default function ComponentsOverviewPage() {
  return (
    <div style={{ inlineSize: '90%', marginInline: 'auto' }}>
      <SpaceBetween direction="vertical" size="xl">
        <Box variant="h1" padding={{ top: 'l' }}>
          Components overview page
        </Box>
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
        <div id="code-view">
          <CodeViewSection />
        </div>
        <div id="chat">
          <Chat />
        </div>
        <div id="board">
          <BoardSection />
        </div>
        <div id="status-components">
          <StatusComponents />
        </div>
        <div id="kvp-form">
          <KvpForm />
        </div>
      </SpaceBetween>
    </div>
  );
}
