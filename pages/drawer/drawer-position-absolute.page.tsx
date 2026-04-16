// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';
import { capitalize, range } from 'lodash';

import { FormField, Input } from '~components';
import Drawer, { NextDrawerProps as DrawerProps } from '~components/drawer/next';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

const accentColor = '#6237a7';
const overlayFontColor = '#ffffff';

type PageContext = React.Context<
  AppContextType<{
    overlayZIndex?: number;
  }>
>;

export default function () {
  const {
    urlParams: { overlayZIndex = 1 },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  return (
    <SimplePage
      title="Drawer position: absolute"
      subtitle="This page demonstrates drawers with absolute position."
      i18n={{}}
      screenshotArea={{}}
      settings={
        <FormField label="Overlay z-index">
          <Input
            type="number"
            value={overlayZIndex.toString()}
            onChange={({ detail }) => setUrlParams({ overlayZIndex: parseInt(detail.value) })}
          />
        </FormField>
      }
    >
      <div style={{ border: `1px solid ${accentColor}`, position: 'relative' }}>
        <div style={{ flex: 1, padding: 16 }}>
          {range(0, 50).map(i => (
            <div key={i}>Line {i + 1}</div>
          ))}
        </div>
        <CustomOverlay zIndex={overlayZIndex}>Custom overlay with zIndex={overlayZIndex}</CustomOverlay>
        <AbsoluteDrawer placement="top" offset={{ start: 200, end: 200 }} zIndex={1} contentHeight={200} />
        <AbsoluteDrawer placement="start" offset={{ bottom: 200 }} zIndex={2} contentWidth={200} />
        <AbsoluteDrawer placement="end" offset={{ bottom: 200 }} zIndex={3} contentWidth={200} />
        <AbsoluteDrawer placement="bottom" offset={{}} zIndex={4} contentHeight={200} />
        <AbsoluteDrawer placement="bottom" offset={{}} zIndex={5} contentHeight={150} />
      </div>
    </SimplePage>
  );
}

function AbsoluteDrawer({
  placement,
  offset,
  zIndex,
  contentWidth,
  contentHeight,
}: DrawerProps & { contentWidth?: number; contentHeight?: number }) {
  const sizeStr = contentHeight ? `height=${contentHeight}px` : `width=${contentWidth}px`;
  const formatOffset = (offset?: DrawerProps.Offset) => JSON.stringify(offset, null, 2).replace(/"/g, '');
  return (
    <Drawer position="absolute" placement={placement} disableContentPaddings={true} offset={offset} zIndex={zIndex}>
      <div style={{ boxSizing: 'border-box', padding: 16, width: contentWidth, height: contentHeight }}>
        {capitalize(placement)} drawer with content {sizeStr}, {`offset=${formatOffset(offset)}`}, and zIndex={zIndex}
      </div>
    </Drawer>
  );
}

function CustomOverlay({ zIndex, children }: { zIndex?: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: accentColor,
        color: overlayFontColor,
        opacity: 0.85,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex,
      }}
    >
      {children}
    </div>
  );
}
