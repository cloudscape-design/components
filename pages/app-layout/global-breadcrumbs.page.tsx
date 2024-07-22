// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '~components/app-layout';
import BreadcrumbGroup from '~components/breadcrumb-group';
import SpaceBetween from '~components/space-between';

import labels from './utils/labels';

export default function () {
  const [extraBreadcrumb, setExtraBreadcrumb] = useState(false);
  return (
    <AppLayout
      ariaLabels={labels}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Default', href: '#' },
            { text: 'one', href: '#' },
          ]}
        />
      }
      content={
        <SpaceBetween size="m">
          <h1>Page with additional breadcrumbs</h1>
          <label>
            <input
              type="checkbox"
              data-testid="toggle-extra-breadcrumb"
              onChange={event => setExtraBreadcrumb(event.target.checked)}
            />{' '}
            Extra breadcrumb
          </label>
          {extraBreadcrumb && (
            <BreadcrumbGroup
              items={[
                { text: 'Dynamic', href: '#' },
                { text: 'instance', href: '#' },
              ]}
            />
          )}
        </SpaceBetween>
      }
    />
  );
}
