// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import Grid from '~components/grid';
import Header from '~components/header';
import Link from '~components/link';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './fit-height.scss';

function SmallContainer() {
  return (
    <Container fitHeight={true} header={<Header>Short</Header>} footer="footer">
      <p>One line of text</p>
    </Container>
  );
}

function MediumContainer() {
  return (
    <Container fitHeight={true} header={<Header>Mid size</Header>} footer="footer">
      <p>Content placeholder</p>
      <div style={{ height: 100 }} className={styles.placeholder}></div>
    </Container>
  );
}

function LargeContainer() {
  return (
    <Container fitHeight={true} header={<Header>Large</Header>} footer="footer">
      <p>
        This container overflows available space. <Link href="#">Learn more</Link>.
      </p>
      <div style={{ height: 400 }} className={styles.placeholder}></div>
    </Container>
  );
}

export default function () {
  return (
    <article>
      <h1>Fit height property demo</h1>
      <ScreenshotArea>
        <h2>Inside display:grid</h2>
        <div className={styles.grid}>
          <SmallContainer />
          <MediumContainer />
          <LargeContainer />
        </div>
        <h2>Inside column layout</h2>
        <ColumnLayout columns={3}>
          <SmallContainer />
          <MediumContainer />
          <LargeContainer />
        </ColumnLayout>
        <h2>Inside grid</h2>
        <Grid gridDefinition={[{ colspan: 6 }, { colspan: 3 }, { colspan: 3 }]}>
          <SmallContainer />
          <MediumContainer />
          <LargeContainer />
        </Grid>
        <h2>Container inside height limit</h2>
        <div className={styles.heightLimit}>
          <LargeContainer />
        </div>
      </ScreenshotArea>
    </article>
  );
}
