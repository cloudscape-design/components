// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ColumnLayout from '~components/column-layout';

import ScreenshotArea from '../utils/screenshot-area';

export default function ColumnLayoutPage() {
  return (
    <>
      <h1>Column layout demo</h1>
      <ScreenshotArea
        style={{
          // text-grid variant has -2rem outer margins that we need to accommodate
          padding: '2rem',
        }}
      >
        <h2>With borders</h2>
        {[1, 2].map(i => (
          <ColumnLayout key={i} columns={4} borders="all">
            <div>One</div>
            <div>Two</div>
            <div>Three</div>
            <div>Four</div>
            <div>Five</div>
            <div>Six</div>
            <div>Seven</div>
            <div>Eight</div>
          </ColumnLayout>
        ))}

        <h2>With gutters disabled</h2>
        {[1, 2].map(i => (
          <ColumnLayout key={i} columns={4} borders="all" disableGutters={true}>
            <div>One</div>
            <div>Two</div>
            <div>Three</div>
            <div>Four</div>
            <div>Five</div>
            <div>Six</div>
            <div>Seven</div>
            <div>Eight</div>
          </ColumnLayout>
        ))}

        <h2>text-grid variant</h2>

        <ColumnLayout variant="text-grid" borders="none" columns={3}>
          <div>a</div>
          <div>b</div>
          <div>c</div>
          <div>a</div>
          <div>b</div>
          <div>c</div>
        </ColumnLayout>

        <h2>Nested with borders</h2>

        <ColumnLayout columns={3} borders="vertical">
          <div>a</div>
          <ColumnLayout columns={2}>
            <div>b</div>
            <div>b</div>
          </ColumnLayout>
          <div>a</div>
        </ColumnLayout>
      </ScreenshotArea>
    </>
  );
}
