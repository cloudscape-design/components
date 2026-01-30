// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Card from '~components/internal/components/card';

import { CardPage } from './common';

export default function ButtonsScenario() {
  const [isActive, setActive] = useState(false);
  return (
    <CardPage title="Action card: action in chat">
      <Card header="Give EC2 access to S3" variant="action" active={isActive} onClick={() => setActive(true)}>
        A more detailed description of the action.
      </Card>
    </CardPage>
  );
}
