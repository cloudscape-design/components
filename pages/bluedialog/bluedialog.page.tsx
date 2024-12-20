// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box } from '~components';

import Bluedialog from './dialog';

export default function BluedialogPage() {
  const submitData = (data: any) => {
    console.log(data); // submit the form with these values to determine next action
  };
  return (
    <Box padding="xxl">
      <Bluedialog onSubmit={submitData} />
    </Box>
  );
}
