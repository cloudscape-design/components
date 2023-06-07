// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Example from './example';
import { createLinearTimeLatencyProps } from './series';

const linearLatencyProps = createLinearTimeLatencyProps();
const xDomain = [0, 119];

export default function () {
  return (
    <>
      <h1>Area charts fit height</h1>
      <div
        style={{ boxSizing: 'border-box', width: '100%', height: '800px', padding: '8px', border: '2px solid black' }}
      >
        <Example name="Linear latency chart" {...linearLatencyProps} xDomain={xDomain} />
      </div>
    </>
  );
}
