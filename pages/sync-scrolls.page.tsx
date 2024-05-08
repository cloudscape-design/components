// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { useScrollSync } from '~components/internal/hooks/use-scroll-sync';
let n = 0;
export default function App() {
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const numberOfCallsRef = useRef<HTMLDivElement>(null);
  const handleScroll = useScrollSync([ref1, ref2]);
  return (
    <>
      <h1>Syncing horizontal scrolls</h1>
      <div
        onScroll={() => {
          n++;
          numberOfCallsRef.current?.setAttribute('data-call-number', n.toString());
        }}
      >
        <div id="element1" ref={ref1} style={{ inlineSize: '400px', overflow: 'scroll' }} onScroll={handleScroll}>
          <div style={{ inlineSize: '800px', blockSize: '100px', backgroundColor: 'lightpink' }} />
        </div>
        <div id="element2" ref={ref2} style={{ width: '400px', overflow: 'scroll' }} onScroll={handleScroll}>
          <div style={{ inlineSize: '800px', blockSize: '100px', backgroundColor: 'lightblue' }} />
        </div>
        <div ref={numberOfCallsRef} id="numberOfCalls">
          Placeholder for a value stored in DOM and used in integration tests
        </div>
      </div>
    </>
  );
}
