// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import { Distribution } from './fake-server/types';
import DataProvider from './pages/commons/data-provider';
import { App } from './pages/table-editable/root';

export default function Page() {
  const [distributions, setDistributions] = useState<Distribution[]>([]);

  useEffect(() => {
    new DataProvider().getData<Distribution>('distributions').then(setDistributions);
  }, []);

  return <App distributions={distributions} />;
}
