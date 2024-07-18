// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import range from 'lodash/range';

import ScreenshotArea from './screenshot-area';

const CHUNK_SIZE = 400;

export default function ScreenshotAreaWarning() {
  const [chunks, setChunks] = useState(1);
  return (
    <>
      <h1>Screenshot max height check</h1>
      <ScreenshotArea>
        <div>
          <button onClick={() => setChunks(chunks + 1)}>Add more items</button>
          <button onClick={() => setChunks(Math.max(chunks - 1, 0))}>Remove items</button>
        </div>
        {range(chunks * CHUNK_SIZE).map(index => (
          <p key={index}>Item {index}</p>
        ))}
      </ScreenshotArea>
    </>
  );
}
