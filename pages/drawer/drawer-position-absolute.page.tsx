// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';
import { capitalize, range } from 'lodash';

import { Checkbox, SpaceBetween } from '~components';
import Drawer, { NextDrawerProps as DrawerProps } from '~components/drawer/next';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

const accentColor = '#6237a7';

type PageContext = React.Context<
  AppContextType<{
    backdrops?: string;
  }>
>;

export default function () {
  const {
    urlParams: { backdrops: backdropsStr = 'top' },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const backdrops = backdropsStr.split(',').map(id => id.trim());
  const hasBackdrop = (id: string) => backdrops.includes(id);
  return (
    <SimplePage
      title="Drawer position: absolute"
      subtitle="This page demonstrates drawers with absolute position."
      i18n={{}}
      screenshotArea={{}}
      settings={
        <SpaceBetween size="xs" direction="horizontal">
          {['top', 'start', 'end', 'bottom-1', 'bottom-2'].map(id => (
            <Checkbox
              key={id}
              checked={hasBackdrop(id)}
              onChange={({ detail }) => {
                const next = detail.checked ? [...backdrops, id] : backdrops.filter(b => b !== id);
                setUrlParams({ backdrops: next.join(',') });
              }}
            >
              Show {id} backdrop
            </Checkbox>
          ))}
        </SpaceBetween>
      }
    >
      <div style={{ border: `1px solid ${accentColor}`, position: 'relative' }}>
        <div style={{ flex: 1, padding: 16 }}>
          {range(0, 50).map(i => (
            <div key={i}>Line {i + 1}</div>
          ))}
        </div>
        <AbsoluteDrawer
          header="Top"
          placement="top"
          offset={{ start: 200, end: 200 }}
          zIndex={1}
          contentHeight={200}
          backdrop={hasBackdrop('top')}
        />
        <AbsoluteDrawer
          header="Start"
          placement="start"
          offset={{ bottom: 200 }}
          zIndex={2}
          contentWidth={200}
          backdrop={hasBackdrop('start')}
        />
        <AbsoluteDrawer
          header="End"
          placement="end"
          offset={{ bottom: 200 }}
          zIndex={3}
          contentWidth={200}
          backdrop={hasBackdrop('end')}
        />
        <AbsoluteDrawer
          header="Bottom 1"
          placement="bottom"
          offset={{}}
          zIndex={4}
          contentHeight={200}
          backdrop={hasBackdrop('bottom-1')}
        />
        <AbsoluteDrawer
          header="Bottom 2"
          placement="bottom"
          offset={{}}
          zIndex={5}
          contentHeight={140}
          backdrop={hasBackdrop('bottom-2')}
        />
      </div>
    </SimplePage>
  );
}

function AbsoluteDrawer({
  header,
  placement,
  offset,
  zIndex,
  contentWidth,
  contentHeight,
  backdrop,
}: DrawerProps & { contentWidth?: number; contentHeight?: number }) {
  const sizeStr = contentHeight ? `height=${contentHeight}px` : `width=${contentWidth}px`;
  const formatOffset = (offset?: DrawerProps.Offset) => JSON.stringify(offset, null, 2).replace(/"/g, '');
  return (
    <Drawer
      header={header}
      position="absolute"
      placement={placement}
      disableContentPaddings={true}
      offset={offset}
      zIndex={zIndex}
      backdrop={backdrop}
    >
      <div style={{ boxSizing: 'border-box', padding: 16, width: contentWidth, height: contentHeight }}>
        {capitalize(placement)} drawer with content {sizeStr}, {`offset=${formatOffset(offset)}`}, and zIndex=
        {zIndex}
      </div>
    </Drawer>
  );
}
