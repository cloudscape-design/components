// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import Checkbox from '~components/checkbox';
import ColumnLayout from '~components/column-layout';
import Grid from '~components/grid';
import ItemCard, { ItemCardProps } from '~components/item-card';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { actions } from './common';

import styles from './fit-height.scss';

type DemoContext = React.Context<AppContextType<{ showFooters: boolean; constrainHeight: boolean }>>;

function ItemCardPlayground(props: ItemCardProps) {
  const { urlParams } = useContext(AppContext as DemoContext);
  return (
    <ItemCard {...props} fitHeight={true} actions={actions} footer={urlParams.showFooters ? props.footer : null} />
  );
}

function SmallCard() {
  return (
    <ItemCardPlayground header="Short" footer="footer">
      One line of text
    </ItemCardPlayground>
  );
}

function MediumCard() {
  return (
    <ItemCardPlayground header="Mid size" footer="footer">
      <p>Content placeholder</p>
      <div style={{ blockSize: 50 }} className={styles.placeholder}></div>
    </ItemCardPlayground>
  );
}

function LargeCard() {
  return (
    <ItemCardPlayground header="Large" footer="footer">
      <p>This item card has the tallest content.</p>
      <div style={{ blockSize: 200 }} className={styles.placeholder}></div>
    </ItemCardPlayground>
  );
}

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  return (
    <SimplePage
      title="Item card fit height"
      settings={
        <Checkbox
          checked={urlParams.showFooters ?? false}
          onChange={({ detail }) => setUrlParams({ showFooters: detail.checked })}
        >
          Show footers
        </Checkbox>
      }
      screenshotArea={{}}
    >
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

      <div>
        <h2>Inside parent with constrained height</h2>
        <div className={styles.short}>
          <SmallCard />
          <MediumCard />
          <LargeCard />
        </div>
      </div>
    </SimplePage>
  );
}
