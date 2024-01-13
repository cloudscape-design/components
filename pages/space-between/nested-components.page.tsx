// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './styles.scss';
import Grid from '~components/grid';
import ColumnLayout from '~components/column-layout';

const ExampleContent = () => <div className={styles.box}>This is some text.</div>;
const NullComponent = () => null;

export default function SpaceBetweenNestedComponents() {
  return (
    <>
      <h1>SpaceBetween with nested layouting components</h1>
      <ScreenshotArea>
        <SpaceBetween size="s">
          <h1>Inside a grid</h1>
          <Grid gridDefinition={[{ colspan: { default: 9, m: 3 } }, { colspan: { default: 3, m: 9 } }]}>
            <SpaceBetween size="xs" direction="horizontal">
              <ExampleContent />
              <ExampleContent />
              <NullComponent />
              <>{null}</>
              <ExampleContent />
            </SpaceBetween>

            <SpaceBetween size="l" direction="horizontal">
              <ExampleContent />
              <ExampleContent />
              <ExampleContent />
            </SpaceBetween>
          </Grid>

          <h1>Inside a column layout</h1>

          <ColumnLayout columns={2} borders="all">
            <SpaceBetween size="xs" direction="horizontal">
              <ExampleContent />
              <ExampleContent />
              <ExampleContent />
            </SpaceBetween>
            <SpaceBetween size="m" direction="horizontal">
              <ExampleContent />
              <ExampleContent />
              <ExampleContent />
            </SpaceBetween>
            <SpaceBetween size="xl" direction="horizontal">
              <ExampleContent />
              <ExampleContent />
              <ExampleContent />
            </SpaceBetween>
          </ColumnLayout>
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
