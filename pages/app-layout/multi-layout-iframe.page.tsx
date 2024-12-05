// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { Box, Button, Checkbox, SpaceBetween } from '~components';

import { IframeWrapper } from '../utils/iframe-wrapper';

function InnerApp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      console.log('ResizeObserver fired:', entries);
    });
    resizeObserver.observe(ref.current!);

    const intersectionObserver = new IntersectionObserver(entries => {
      console.log('IntersectionObserver fired:', entries);
    });
    intersectionObserver.observe(ref.current!);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div ref={ref} style={{ height: 300, background: 'yellow', padding: 10 }}>
      This is the iframe
    </div>
  );
}

export default function () {
  const [checked, setChecked] = useState(false);
  return (
    <Box padding="xl">
      <SpaceBetween size="l">
        <h1>with iframe</h1>
        <Checkbox checked={checked} onChange={e => setChecked(e.detail.checked)}>
          Show iframe
        </Checkbox>
        <Button onClick={() => setTimeout(() => setChecked(true), 5_000)}>Show with 5s delay</Button>

        <div style={{ border: '1px solid grey', padding: 10 }}>
          <div style={{ marginBottom: 100 }}>This is the area that will contain the iframe.</div>

          <div style={{ display: checked ? 'block' : 'none', marginTop: 300 }}>
            <IframeWrapper id="inner-iframe" AppComponent={InnerApp} />
          </div>
        </div>
      </SpaceBetween>
    </Box>
  );
}
