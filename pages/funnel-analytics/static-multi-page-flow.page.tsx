// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '~components/app-layout';
import BreadcrumbGroup from '~components/breadcrumb-group';
import { setFunnelMetrics } from '~components/internal/analytics';

import labels from '../app-layout/utils/labels';
import { MockedFunnelMetrics } from './mock-funnel';
import { WizardFlow } from './shared/wizard-flow';

setFunnelMetrics(MockedFunnelMetrics);

export default function MultiPageCreate() {
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
      content={
        <>
          <button data-testid="unmount" onClick={() => setMounted(false)}>
            Unmount
          </button>
          {mounted && <WizardFlow onUnmount={() => setMounted(false)} />}
        </>
      }
    />
  );
}
