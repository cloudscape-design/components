// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { Button, Checkbox, SegmentedControl, SpaceBetween } from '~components';
import PanelLayout, { PanelLayoutProps } from '~components/panel-layout';
import { colorBackgroundCellShaded } from '~design-tokens';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageContext = React.Context<
  AppContextType<{
    display: PanelLayoutProps.Display;
    panelPosition: PanelLayoutProps.PanelPosition;
    disablePanelScrolling: boolean;
    disableMainScrolling: boolean;
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

export default function PanelLayoutDisableScrollingPage() {
  const {
    urlParams: {
      display = 'all',
      panelPosition = 'side-start',
      disablePanelScrolling = false,
      disableMainScrolling = false,
      tallContent = false,
    },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  return (
    <SimplePage
      title="Panel layout with disabled scrolling"
      screenshotArea={{}}
      settings={
        <SpaceBetween size="s">
          <SegmentedControl
            label="Display"
            options={[
              { id: 'all', text: 'all' },
              { id: 'panel-only', text: 'panel-only' },
              { id: 'main-only', text: 'main-only' },
            ]}
            selectedId={display}
            onChange={({ detail }) => setUrlParams({ display: detail.selectedId as PanelLayoutProps.Display })}
          />
          <SegmentedControl
            label="Panel position"
            options={[
              { id: 'side-start', text: 'side-start' },
              { id: 'side-end', text: 'side-end' },
            ]}
            selectedId={panelPosition}
            onChange={({ detail }) =>
              setUrlParams({ panelPosition: detail.selectedId as PanelLayoutProps.PanelPosition })
            }
          />
          <Checkbox
            checked={disablePanelScrolling}
            onChange={({ detail }) => setUrlParams({ disablePanelScrolling: detail.checked })}
          >
            disablePanelScrolling
          </Checkbox>
          <Checkbox
            checked={disableMainScrolling}
            onChange={({ detail }) => setUrlParams({ disableMainScrolling: detail.checked })}
          >
            disableMainScrolling
          </Checkbox>
          <Checkbox checked={tallContent} onChange={({ detail }) => setUrlParams({ tallContent: detail.checked })}>
            Tall content
          </Checkbox>
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
          disablePanelScrolling={disablePanelScrolling}
          disableMainScrolling={disableMainScrolling}
          panelContent={<EdgeContent label="Panel" tall={tallContent} />}
          mainContent={<EdgeContent label="Main" tall={tallContent} />}
        />
      </div>
    </SimplePage>
  );
}
