// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import Box from '~components/box';
import NavigationBar from '~components/navigation-bar';
import Select from '~components/select';

import AppContext, { AppContextType } from '../app/app-context';
import { filler, primaryHorizontalContent, primaryVerticalContent } from './common';

type PageContext = React.Context<AppContextType<{ placement: string }>>;

export default function PrimaryPage() {
  const {
    urlParams: { placement = 'top' },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const p = placement as 'top' | 'bottom' | 'start' | 'end';
  const isVertical = p === 'start' || p === 'end';
  const content = isVertical ? primaryVerticalContent : primaryHorizontalContent;

  const scrollableContent = (
    <div style={{ flex: 1, overflow: 'auto', padding: '16px' }} tabIndex={0}>
      <Box variant="h1">NavigationBar — Primary</Box>
      <Box padding={{ vertical: 's' }}>
        <Select
          selectedOption={{ value: placement, label: `placement="${placement}"` }}
          options={[
            { value: 'top', label: 'placement="top"' },
            { value: 'bottom', label: 'placement="bottom"' },
            { value: 'start', label: 'placement="start"' },
            { value: 'end', label: 'placement="end"' },
          ]}
          onChange={({ detail }) => setUrlParams({ placement: detail.selectedOption.value! })}
        />
      </Box>
      {filler}
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'row' : 'column',
        height: 'calc(100dvh - var(--app-header-height, 40px))',
      }}
    >
      {(p === 'top' || p === 'start') && (
        <NavigationBar variant="primary" placement={p} ariaLabel="Primary navigation" content={content} />
      )}
      {scrollableContent}
      {(p === 'bottom' || p === 'end') && (
        <NavigationBar variant="primary" placement={p} ariaLabel="Primary navigation" content={content} />
      )}
    </div>
  );
}
