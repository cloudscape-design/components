// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import labels from './utils/labels';
import styles from './styles.scss';

function Counter({ id }: { id: string }) {
  const [count, setCount] = useState(0);
  return (
    <div className={styles.textContent}>
      <span id={`${id}-text`}>Clicked: {count}</span>
      <button id={`${id}-button`} onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default function AppLayoutStatefulDemo() {
  return (
    <AppLayout
      ariaLabels={labels}
      breadcrumbs={<Counter id="breadcrumbs" />}
      navigation={<Counter id="navigation" />}
      tools={<Counter id="tools" />}
      content={
        <>
          <div style={{ marginBlockEnd: '1rem' }}>
            <Header variant="h1" description="Basic demo">
              Stateful components demo
            </Header>
          </div>
          <Counter id="content" />
        </>
      }
    />
  );
}
