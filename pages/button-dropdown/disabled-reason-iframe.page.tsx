// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box } from '~components';

import { IframeWrapper } from '../utils/iframe-wrapper';
import { DisabledReasonDemo } from './disabled-reason.page';

export default function () {
  return (
    <Box margin="m">
      <h1>ButtonDropdown disabled reason in iframe</h1>
      <IframeWrapper id="button-dropdown-iframe" AppComponent={DisabledReasonDemo} />
    </Box>
  );
}
