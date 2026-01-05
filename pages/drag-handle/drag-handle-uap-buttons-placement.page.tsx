// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import { Box, Checkbox, SpaceBetween } from '~components';
import DragHandle, { DragHandleProps } from '~components/internal/components/drag-handle';
import { colorBackgroundStatusInfo } from '~design-tokens';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageContext = React.Context<
  AppContextType<{
    hideStart: boolean;
    hideEnd: boolean;
    hideTop: boolean;
    hideBottom: boolean;
  }>
>;

export default function TestBoardItemButton() {
  const {
    urlParams: { hideStart = false, hideEnd = false, hideTop = false, hideBottom = false },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const dragHandleProps = (id: string): DragHandleProps & { 'data-testid': string } => ({
    variant: 'drag-indicator',
    ariaLabel: id,
    'data-testid': id,
    directions: {
      'inline-start': hideStart ? undefined : 'active',
      'inline-end': hideEnd ? undefined : 'active',
      'block-start': hideTop ? undefined : 'active',
      'block-end': hideBottom ? undefined : 'active',
    },
  });
  return (
    <SimplePage
      title={
        <Box fontSize="heading-l" fontWeight="bold" margin={{ top: 'xl' }}>
          UAP buttons placement
        </Box>
      }
      i18n={{}}
      screenshotArea={{ disableAnimations: true }}
      settings={
        <SpaceBetween size="s" direction="horizontal">
          <Checkbox checked={hideStart} onChange={({ detail }) => setUrlParams({ hideStart: detail.checked })}>
            Hide start
          </Checkbox>
          <Checkbox checked={hideEnd} onChange={({ detail }) => setUrlParams({ hideEnd: detail.checked })}>
            Hide end
          </Checkbox>
          <Checkbox checked={hideTop} onChange={({ detail }) => setUrlParams({ hideTop: detail.checked })}>
            Hide top
          </Checkbox>
          <Checkbox checked={hideBottom} onChange={({ detail }) => setUrlParams({ hideBottom: detail.checked })}>
            Hide bottom
          </Checkbox>
        </SpaceBetween>
      }
    >
      <div style={{ position: 'absolute', inset: 4 }}>
        <DragHandleWrapper {...dragHandleProps('top-start')} inset={['8px', '', '', '0px']} />
        <DragHandleWrapper {...dragHandleProps('top-mid')} inset={['8px', '', '', '50%']} />
        <DragHandleWrapper {...dragHandleProps('top-end')} inset={['8px', '0px', '', '']} />
        <DragHandleWrapper {...dragHandleProps('near-top-start')} inset={['50px', '', '', '0px']} />
        <DragHandleWrapper {...dragHandleProps('near-top-mid')} inset={['50px', '', '', '50%']} />
        <DragHandleWrapper {...dragHandleProps('near-top-end')} inset={['50px', '0px', '', '']} />
        <DragHandleWrapper {...dragHandleProps('mid-start')} inset={['50%', '', '', '0px']} />
        <DragHandleWrapper {...dragHandleProps('mid-mid')} inset={['50%', '', '', '50%']} />
        <DragHandleWrapper {...dragHandleProps('mid-end')} inset={['50%', '0px', '', '']} />
        <DragHandleWrapper {...dragHandleProps('bottom-start')} inset={['', '', '0px', '0px']} />
        <DragHandleWrapper {...dragHandleProps('bottom-mid')} inset={['', '', '0px', '50%']} />
        <DragHandleWrapper {...dragHandleProps('bottom-end')} inset={['', '0px', '0px', '']} />
      </div>
    </SimplePage>
  );
}

function DragHandleWrapper({ inset, ...props }: DragHandleProps & { inset: string[] }) {
  return (
    <div
      style={{
        position: 'absolute',
        insetBlockStart: inset[0],
        insetInlineEnd: inset[1],
        insetBlockEnd: inset[2],
        insetInlineStart: inset[3],
      }}
    >
      <div style={{ display: 'inline', padding: 4, background: colorBackgroundStatusInfo, borderRadius: '50%' }}>
        <DragHandle {...props} />
      </div>
    </div>
  );
}
