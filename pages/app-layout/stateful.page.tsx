// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Header from '~components/header';

import { Counter } from './utils/content-blocks';
import labels from './utils/labels';

export default function AppLayoutStatefulDemo() {
  return (
    <AppLayout
      ariaLabels={labels}
      breadcrumbs={
        <nav aria-label="Breadcrumbs">
          <Counter id="breadcrumbs" />
        </nav>
      }
      navigation={<Counter id="navigation" />}
      tools={<Counter id="tools" />}
      content={
        <>
          <div style={{ marginBlockEnd: '1rem' }}>
            <Header variant="h1" description="Basic demo">
              Stateful components demo
            </Header>
          </div>
          <Counter id="content" />
        </>
      }
    />
  );
}
