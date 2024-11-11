// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '~components/app-layout';
import BreadcrumbGroup from '~components/breadcrumb-group';
import { setFunnelMetrics } from '~components/internal/analytics';
import ScreenreaderOnly from '~components/internal/components/screenreader-only';

import labels from '../app-layout/utils/labels';
import { IframeWrapper } from '../utils/iframe-wrapper';
import ScreenshotArea from '../utils/screenshot-area';
import { MockedFunnelMetrics } from './mock-funnel';
import { WizardFlow } from './shared/wizard-flow';

setFunnelMetrics(MockedFunnelMetrics);

function InnerApp() {
  const [mounted, setMounted] = useState(true);
  return (
    <AppLayout
      ariaLabels={labels}
      contentType="wizard"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'System', href: '#' },
            { text: 'Components', href: '#components' },
            {
              text: 'Create Resource',
              href: '#components/breadcrumb-group',
            },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      navigationHide={true}
      toolsHide={true}
      content={mounted ? <WizardFlow onUnmount={() => setMounted(false)} /> : 'no wizard'}
    />
  );
}

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        data-testid="main-layout"
        ariaLabels={labels}
        toolsHide={true}
        disableContentPaddings={true}
        content={
          <>
            <ScreenreaderOnly>
              <h1>All content lives in iframe</h1>
            </ScreenreaderOnly>
            <IframeWrapper id="inner-iframe" AppComponent={InnerApp} />
          </>
        }
      />
    </ScreenshotArea>
  );
}
