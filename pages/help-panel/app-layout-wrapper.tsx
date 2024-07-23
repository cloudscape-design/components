// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';

import labels from '../app-layout/utils/labels';

export default function AppLayoutWrapper({ tools }: AppLayoutProps) {
  return (
    <AppLayout ariaLabels={labels} tools={tools} navigationHide={true} toolsOpen={true} content={<h1>Title</h1>} />
  );
}
