// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import HelpPanel from '~components/help-panel';
import Icon from '~components/icon';
import AppLayoutWrapper from './app-layout-wrapper';
import ScreenshotArea from '../utils/screenshot-area';

const toolsPanel = (
  <HelpPanel
    header={<h2>Help panel title (h2)</h2>}
    footer={
      <>
        <h3>
          Learn more <Icon name="external" />
        </h3>
        <ul>
          <li>
            <a href="">Link to documentation</a>
          </li>
        </ul>
      </>
    }
  >
    <div>
      <p>
        This is a paragraph with some <b>bold text</b> and also some <i>italic text</i>.
      </p>

      <h3>h3 section header</h3>
      <dl>
        <dt>This is a term</dt>
        <dd>This is its description.</dd>
        <dt>This is a term</dt>
        <dd>This is its description</dd>
      </dl>
    </div>
  </HelpPanel>
);

export default function HelpPanelSimple() {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayoutWrapper tools={toolsPanel} />
    </ScreenshotArea>
  );
}
