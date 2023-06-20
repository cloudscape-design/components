// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Alert from '~components/alert';
import ScreenshotArea from '../utils/screenshot-area';
import SpaceBetween from '~components/space-between';

import { I18nProvider } from '~components/internal/i18n';
import messages from '~components/i18n/messages/all.all';
import { Flashbar, StatusIndicator } from '~components';

export default function AlertScenario() {
  return (
    <I18nProvider messages={[messages]} locale="en">
      <article>
        <h1>Warning color updates</h1>
        <ScreenshotArea>
          <SpaceBetween size="xl">
            <Alert statusIconAriaLabel="Warning" dismissible={true} type="warning">
              Alert description
            </Alert>

            <Flashbar items={[{ id: '1', type: 'warning', content: 'Flash description' }]} />

            <StatusIndicator type="warning" iconAriaLabel="Warnign">
              Warning
            </StatusIndicator>
          </SpaceBetween>
        </ScreenshotArea>
      </article>
    </I18nProvider>
  );
}
