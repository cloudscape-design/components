// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Card from '~components/internal/components/card';

import { CardPage } from './common';

export default function ButtonsScenario() {
  return (
    <CardPage title="Action card">
      <Card header="EC2 access to S3" variant="action">
        A description of the template / ice breaker
      </Card>
    </CardPage>
  );
}
