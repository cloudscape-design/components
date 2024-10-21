// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import {
  Box,
  ColumnLayout,
  Container,
  ContainerProps,
  Grid,
  Header,
  KeyValuePairs,
  Link,
  SpaceBetween,
  Table,
} from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { generateItems } from '../table/generate-data';
import { columnsConfig } from '../table/shared-configs';
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
        <h2>Content variants</h2>
        <SpaceBetween size="m">
          <Container fitHeight={true}>
            <ServiceOverview />
          </Container>

          <Container fitHeight={true}>
            <ServiceOverviewWithPadding />
          </Container>

          <div style={{ maxInlineSize: '500px' }}>
            <Container fitHeight={true}>
              <TableWithStickyScrollbar />
            </Container>
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}

function ServiceOverview() {
  return (
    <KeyValuePairs
      columns={4}
      items={[
        {
          label: 'Running instances',
          value: (
            <Link variant="awsui-value-large" href="#" ariaLabel="Running instances (14)">
              14
            </Link>
          ),
        },
        {
          label: 'Volumes',
          value: (
            <Link variant="awsui-value-large" href="#" ariaLabel="Volumes (126)">
              126
            </Link>
          ),
        },
        {
          label: 'Security groups',
          value: (
            <Link variant="awsui-value-large" href="#" ariaLabel="Security groups (116)">
              116
            </Link>
          ),
        },
        {
          label: 'Load balancers',
          value: (
            <Link variant="awsui-value-large" href="#" ariaLabel="Load balancers (28)">
              28
            </Link>
          ),
        },
      ]}
    />
  );
}

function ServiceOverviewWithPadding() {
  return (
    <Box padding={{ bottom: 'xs' }}>
      <ServiceOverview />
    </Box>
  );
}

const allItems = generateItems(10);
function TableWithStickyScrollbar() {
  return (
    <Table
      variant="borderless"
      header={
        <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
          Table with sticky scrollbar
        </Header>
      }
      columnDefinitions={columnsConfig}
      items={allItems}
    />
  );
}
