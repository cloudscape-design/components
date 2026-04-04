// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';
import { range } from 'lodash';

import { Box, Checkbox, SpaceBetween } from '~components';
import Drawer from '~components/drawer/next';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

const accentColor = '#6237a7';

type PageContext = React.Context<
  AppContextType<{
    offsets?: boolean;
    stickyOffsets?: boolean;
  }>
>;

export default function () {
  const {
    urlParams: { offsets = false, stickyOffsets = false },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const offset = offsets ? { start: 50, end: 50, top: 20, bottom: 20 } : undefined;
  const stickyOffset = stickyOffsets ? { top: 50, bottom: 50 } : undefined;
  const offsetProps = { offset, stickyOffset };
  return (
    <SimplePage
      title="Drawer position: sticky"
      subtitle="This page demonstrates drawers with sticky position. Drawers in sticky position only support top and bottom placements."
      i18n={{}}
      screenshotArea={{}}
      settings={
        <SpaceBetween size="s">
          <Checkbox checked={offsets} onChange={({ detail }) => setUrlParams({ offsets: detail.checked })}>
            Use offsets {offset && <Box variant="awsui-inline-code">{JSON.stringify(offset, null, 2)}</Box>}
          </Checkbox>
          <Checkbox checked={stickyOffsets} onChange={({ detail }) => setUrlParams({ stickyOffsets: detail.checked })}>
            Use sticky offsets{' '}
            {stickyOffset && <Box variant="awsui-inline-code">{JSON.stringify(stickyOffset, null, 2)}</Box>}
          </Checkbox>
        </SpaceBetween>
      }
    >
      <div style={{ border: `1px solid ${accentColor}` }}>
        <Drawer header="Sticky top drawer" footer="Footer" position="sticky" placement="top" {...offsetProps}>
          Content
        </Drawer>
        <div style={{ flex: 1, padding: 16 }}>
          {range(0, 100).map(i => (
            <div key={i}>Line {i + 1}</div>
          ))}
        </div>
        <Drawer header="Sticky bottom drawer" footer="Footer" position="sticky" placement="bottom" {...offsetProps}>
          Content
        </Drawer>
      </div>
    </SimplePage>
  );
}
