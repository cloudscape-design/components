// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import Button from '~components/button';
import Box from '~components/box';
import Modal from '~components/modal';

export default function ButtonsPerformanceMarkPage() {
  const marks = usePerformanceMarks();

  return (
    <Box padding="xxl">
      <h1>Performance marks in a Modal</h1>

      <Modal
        visible={true}
        footer={<Button variant="primary">Button INSIDE modal</Button>}
        header="Performance marks on this page"
        closeAriaLabel="Close"
      >
        <pre>
          {marks.map((m, index) => (
            <React.Fragment key={index}>
              <b>{m.name}</b>
              <pre>Details: {JSON.stringify(m.detail, null, 2)}</pre>
            </React.Fragment>
          ))}
        </pre>
      </Modal>

      <Button variant="primary">Button OUTSIDE modal</Button>
    </Box>
  );
}

function usePerformanceMarks() {
  const [marks, setMarks] = useState<PerformanceMark[]>([]);

  useEffect(() => {
    const existingEntries = (performance.getEntriesByType('mark') as PerformanceMark[]).filter(isNotReactDevTools);
    setMarks(existingEntries);

    const observer = new PerformanceObserver(list => {
      const newEntries = (list.getEntries() as PerformanceMark[]).filter(isNotReactDevTools);
      if (newEntries.length > 0) {
        setMarks(existing => [...existing, ...newEntries]);
      }
    });

    observer.observe({ type: 'mark' });
    return () => observer.disconnect();
  }, [setMarks]);

  return marks;
}

// This prevents an infinite rerendering loop.
const isNotReactDevTools = (m: PerformanceMark) => !m.name.includes('⚛') && m.name !== '__v3';
