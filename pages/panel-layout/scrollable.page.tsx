// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { Button, Checkbox, SpaceBetween } from '~components';
import PanelLayout, { PanelLayoutProps } from '~components/panel-layout';
import { colorBackgroundCellShaded } from '~design-tokens';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';
import FocusTarget from '../common/focus-target';
import { DisplaySetting, PanelPositionSetting } from './common';

type PageContext = React.Context<
  AppContextType<{
    display: PanelLayoutProps.Display;
    panelPosition: PanelLayoutProps.PanelPosition;
    scrollable: boolean;
    tallContent: boolean;
  }>
>;

// Buttons flush with both inline edges, to check whether their focus rings are clipped.
function EdgeContent({ label, tall }: { label: string; tall: boolean }) {
  return (
    <div style={{ background: colorBackgroundCellShaded, blockSize: tall ? 600 : '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button>{label} start</Button>
        <Button>{label} end</Button>
      </div>
    </div>
  );
}

export default function PanelLayoutScrollablePage() {
  const {
    urlParams: { display = 'all', panelPosition = 'side-start', scrollable = false, tallContent = false },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  return (
    <SimplePage
      title="Panel layout scrollable"
      screenshotArea={{}}
      i18n={{}}
      settings={
        <SpaceBetween size="s">
          <DisplaySetting value={display} onChange={value => setUrlParams({ display: value })} />
          <PanelPositionSetting value={panelPosition} onChange={value => setUrlParams({ panelPosition: value })} />
          <Checkbox checked={scrollable} onChange={({ detail }) => setUrlParams({ scrollable: detail.checked })}>
            scrollable
          </Checkbox>
          <Checkbox checked={tallContent} onChange={({ detail }) => setUrlParams({ tallContent: detail.checked })}>
            Tall content
          </Checkbox>
          <FocusTarget />
        </SpaceBetween>
      }
    >
      <div style={{ blockSize: 300 }}>
        <PanelLayout
          resizable={true}
          defaultPanelSize={300}
          minPanelSize={200}
          display={display}
          panelPosition={panelPosition}
          scrollable={scrollable}
          panelContent={<EdgeContent label="Panel" tall={tallContent} />}
          mainContent={<EdgeContent label="Main" tall={tallContent} />}
        />
      </div>
    </SimplePage>
  );
}
