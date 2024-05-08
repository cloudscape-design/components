// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import ColumnLayout from '~components/column-layout';
import Container, { ContainerProps } from '~components/container';
import Grid from '~components/grid';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './fit-height.scss';

type DemoContext = React.Context<AppContextType<{ hideFooters: boolean; disableContentPaddings: boolean }>>;

function ContainerPlayground(props: ContainerProps) {
  const { urlParams } = useContext(AppContext as DemoContext);
  return (
    <Container
      {...props}
      disableContentPaddings={urlParams.disableContentPaddings}
      footer={urlParams.hideFooters ? null : props.footer}
    />
  );
}

function SmallContainer() {
  return (
    <ContainerPlayground fitHeight={true} header={<Header>Short</Header>} footer="footer">
      <p>One line of text</p>
    </ContainerPlayground>
  );
}

function MediumContainer() {
  return (
    <ContainerPlayground fitHeight={true} header={<Header>Mid size</Header>} footer="footer">
      <p>Content placeholder</p>
      <div style={{ blockSize: 100 }} className={styles.placeholder}></div>
    </ContainerPlayground>
  );
}

function LargeContainer() {
  return (
    <ContainerPlayground fitHeight={true} header={<Header>Large</Header>} footer="footer">
      <p>
        This container overflows available space. <Link href="#">Learn more</Link>.
      </p>
      <div style={{ blockSize: 400 }} className={styles.placeholder}></div>
    </ContainerPlayground>
  );
}

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  return (
    <article>
      <h1>Fit height property demo</h1>
      <SpaceBetween size="s" direction="horizontal">
        <label>
          <input
            type="checkbox"
            checked={urlParams.hideFooters ?? false}
            onChange={event => setUrlParams({ hideFooters: event.target.checked })}
          />{' '}
          Hide footers
        </label>
        <label>
          <input
            type="checkbox"
            checked={urlParams.disableContentPaddings ?? false}
            onChange={event => setUrlParams({ disableContentPaddings: event.target.checked })}
          />{' '}
          Disable content paddings
        </label>
      </SpaceBetween>
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
