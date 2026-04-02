// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';
import { capitalize, range } from 'lodash';

import { Box, Checkbox, Select, SpaceBetween } from '~components';
import Drawer, { NextDrawerProps as DrawerProps } from '~components/drawer/next';
import { colorBackgroundCellShaded as contentBackgroundColor } from '~design-tokens';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

const accentColor = '#6237a7';
const overlayFontColor = '#ffffff';

type PageContext = React.Context<
  AppContextType<{
    offsets?: boolean;
    customOverlay?: boolean;
    placement?: DrawerProps.Placement;
  }>
>;

const placementOptions = [{ value: 'top' }, { value: 'bottom' }, { value: 'start' }, { value: 'end' }];

export default function () {
  const {
    urlParams: { offsets = false, customOverlay = false, placement = 'bottom' },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const offset = offsets ? { start: 50, end: 50, top: 50, bottom: 50 } : {};
  return (
    <SimplePage
      title="Drawer position: viewport"
      subtitle="This page demonstrates drawers with viewport (fixed) position."
      i18n={{}}
      screenshotArea={{}}
    >
      <div>
        {range(0, 50).map(i => (
          <div key={i}>Line {i + 1}</div>
        ))}
      </div>

      {customOverlay && <CustomOverlay>Custom fixed overlay</CustomOverlay>}

      <ViewportDrawer placement={placement} disableContentPaddings={true} offset={offset}>
        <Checkbox checked={offsets} onChange={({ detail }) => setUrlParams({ offsets: detail.checked })}>
          Use offsets
        </Checkbox>
        <Checkbox checked={customOverlay} onChange={({ detail }) => setUrlParams({ customOverlay: detail.checked })}>
          Show custom overlay
        </Checkbox>
        <Select
          inlineLabelText="Placement"
          options={placementOptions}
          selectedOption={placementOptions.find(o => o.value === placement) ?? null}
          onChange={({ detail }) => setUrlParams({ placement: detail.selectedOption.value as DrawerProps.Placement })}
        />
      </ViewportDrawer>
    </SimplePage>
  );
}

function ViewportDrawer({ placement, offset, zIndex, children }: DrawerProps) {
  const formatOffset = (offset?: DrawerProps.Offset) => JSON.stringify(offset, null, 2).replace(/"/g, '');
  return (
    <Drawer position="viewport" placement={placement} disableContentPaddings={true} offset={offset} zIndex={zIndex}>
      <div
        style={{ boxSizing: 'border-box', padding: 16, width: 300, height: 300, background: contentBackgroundColor }}
      >
        <SpaceBetween size="xs">
          <Box>
            {capitalize(placement)} drawer with 300px/300px content and {`offset=${formatOffset(offset)}`}
          </Box>
          {children}
        </SpaceBetween>
      </div>
    </Drawer>
  );
}

function CustomOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: accentColor,
        color: overlayFontColor,
        opacity: 0.85,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
}
