// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ActionCard, { ActionCardProps } from '~components/action-card';
import ColumnLayout from '~components/column-layout';
import Grid from '~components/grid';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';
import { icon, onClick, shortDescription } from './common';

import styles from './fit-height.scss';

function ActionCardPlayground(props: ActionCardProps) {
  return <ActionCard {...props} fitHeight={true} description={shortDescription} onClick={onClick} icon={icon} />;
}

function SmallCard() {
  return <ActionCardPlayground header="Short">One line of text</ActionCardPlayground>;
}

function MediumCard() {
  return (
    <ActionCardPlayground header="Mid size">
      <p>Content placeholder</p>
      <div style={{ blockSize: 50 }} className={styles.placeholder}></div>
    </ActionCardPlayground>
  );
}

function LargeCard() {
  return (
    <ActionCardPlayground header="Large">
      <p>This action card has the tallest content.</p>
      <div style={{ blockSize: 200 }} className={styles.placeholder}></div>
    </ActionCardPlayground>
  );
}

export default function () {
  return (
    <SimplePage title="Action card fit height" screenshotArea={{}}>
      <div>
        <h2>Inside display:grid</h2>
        <div className={styles.grid}>
          <SmallCard />
          <MediumCard />
          <LargeCard />
        </div>
      </div>

      <div>
        <h2>Inside column layout</h2>
        <ColumnLayout columns={3}>
          <SmallCard />
          <MediumCard />
          <LargeCard />
        </ColumnLayout>
      </div>

      <div>
        <h2>Inside grid</h2>
        <Grid gridDefinition={[{ colspan: 6 }, { colspan: 3 }, { colspan: 3 }]}>
          <SmallCard />
          <MediumCard />
          <LargeCard />
        </Grid>
      </div>

      <div>
        <h2>Inside horizontal space between</h2>
        <SpaceBetween size="m" direction="horizontal">
          <SmallCard />
          <MediumCard />
          <LargeCard />
        </SpaceBetween>
      </div>
    </SimplePage>
  );
}
