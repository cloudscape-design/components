// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import range from 'lodash/range';

import AppLayout from '~components/app-layout';
import Header from '~components/header';
import RadioGroup from '~components/radio-group';
import SideNavigation from '~components/side-navigation';
import SplitPanel from '~components/split-panel';

import AppContext, { AppContextType } from '../app/app-context';
import { Footer, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';
import * as toolsContent from './utils/tools-content';

const overflowWhenSplitPanelIsAtBottom = (
  <div
    style={{
      height: 400,
    }}
  ></div>
);

const overflowWhenSplitPanelIsOnSide = (
  <div style={{ display: 'flex', gap: '2000px 350px', flexWrap: 'wrap' }}>
    <div>Item 1</div>
    <div>Item 2</div>
  </div>
);

const overflowNever = 'Short content';

const overflowAlways = <div style={{ height: 1200 }}></div>;

const contentByOverflowCondition = {
  side: overflowWhenSplitPanelIsOnSide,
  bottom: overflowWhenSplitPanelIsAtBottom,
  never: overflowNever,
  always: overflowAlways,
};

type ScrollbarCondition = 'side' | 'bottom' | 'never' | 'always';

type SplitPanelDemoContext = React.Context<
  AppContextType<{
    scrollbarDisplayCondition: ScrollbarCondition;
    toolsEnabled: boolean;
  }>
>;

export default function () {
  const {
    urlParams: { scrollbarDisplayCondition = 'always' },
    setUrlParams,
  } = useContext(AppContext as SplitPanelDemoContext);

  const [splitPanelOpen, setSplitPanelOpen] = useState(true);

  return (
    <>
      <AppLayout
        ariaLabels={labels}
        navigation={
          <SideNavigation
            header={{
              href: '#',
              text: 'Service name',
            }}
            items={range(3).map(i => ({ type: 'link', text: `Navigation #${i + 1}`, href: `#item-${i}` }))}
          />
        }
        navigationOpen={true}
        disableContentPaddings={true}
        minContentWidth={300}
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={e => setSplitPanelOpen(e.detail.open)}
        splitPanelPreferences={{
          position: 'side',
        }}
        tools={<Tools>{toolsContent.long}</Tools>}
        content={
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 0, 0.1)',
              borderBottom: '1px dashed gray',
            }}
          >
            <Header variant="h1">Split panel with body scroll</Header>
            {contentByOverflowCondition[scrollbarDisplayCondition]}
          </div>
        }
        splitPanel={
          <SplitPanel header="Split panel header" i18nStrings={splitPaneli18nStrings}>
            <div id="radio-group-label">Let content overflow vertically when split panel is:</div>
            <RadioGroup
              ariaLabelledby="radio-group-label"
              value={scrollbarDisplayCondition}
              onChange={({ detail }) => setUrlParams({ scrollbarDisplayCondition: detail.value as ScrollbarCondition })}
              items={[
                {
                  value: 'side',
                  label: 'On the side',
                },
                {
                  value: 'bottom',
                  label: 'At the bottom',
                },
                {
                  value: 'always',
                  label: 'Always',
                },
                {
                  value: 'never',
                  label: 'Never',
                },
              ]}
            />
          </SplitPanel>
        }
      />
      <Footer legacyConsoleNav={false} />
    </>
  );
}
