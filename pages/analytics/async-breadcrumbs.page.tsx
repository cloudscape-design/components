// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import { AppLayout, BreadcrumbGroup, StatusIndicator, Wizard } from '~components';

import { withFunnelTestingApi } from './components/funnel-testing-page';

function DelayedBreadcrumbs() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <StatusIndicator type="loading">Loading breadcrumbs</StatusIndicator>;
  }

  return (
    <BreadcrumbGroup
      items={[
        { text: 'System', href: '#' },
        { text: 'Components', href: '#components' },
        { text: 'Create component', href: '#components/create' },
      ]}
      ariaLabel="Breadcrumbs"
    />
  );
}

function App() {
  return (
    <AppLayout
      contentType="wizard"
      breadcrumbs={<DelayedBreadcrumbs />}
      content={
        <Wizard
          i18nStrings={{
            stepNumberLabel: stepNumber => `Step ${stepNumber}`,
            collapsedStepsLabel: (stepNumber, stepsCount) => `Step ${stepNumber} of ${stepsCount}`,
            skipToButtonLabel: step => `Skip to ${step.title}`,
            navigationAriaLabel: 'Steps',
            cancelButton: 'Cancel',
            previousButton: 'Previous',
            nextButton: 'Next',
            submitButton: 'Launch instance',
            optional: 'optional',
          }}
          steps={[]}
        />
      }
    />
  );
}

export default withFunnelTestingApi(App);
