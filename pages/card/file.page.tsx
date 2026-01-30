// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Icon from '~components/icon';
import Card from '~components/internal/components/card';

import { CardPage } from './common';

export default function CardScenario() {
  return (
    <CardPage title="File preview">
      <Card
        header="user-budget.csv"
        description="1.7 MB"
        actions={<Button variant="icon" iconName="download" ariaLabel="Download" />}
        icon={<Icon name="file" />}
      />
    </CardPage>
  );
}
