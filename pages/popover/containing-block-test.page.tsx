// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';

import { Box, Checkbox, SpaceBetween } from '~components';
import Popover, { PopoverProps } from '~components/popover';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';

type PageContext = React.Context<
  AppContextType<{
    renderWithPortal: boolean;
  }>
>;

export default function () {
  const {
    urlParams: { renderWithPortal = true },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  const popoverProps: PopoverProps = {
    size: 'medium',
    position: 'bottom',
    header: 'Memory error',
    content: (
      <Box>
        This instance contains insufficient memory. Stop the instance, choose a different instance type with more
        memory, and restart it.
      </Box>
    ),
    dismissAriaLabel: 'Close',
    triggerType: 'custom',
    renderWithPortal,
  };

  return (
    <Box margin="m">
      <SpaceBetween size="m">
        <Box variant="h1">Popover inside a container with CSS container query</Box>

        <Checkbox
          checked={renderWithPortal}
          onChange={({ detail }) => setUrlParams({ renderWithPortal: !!detail.checked })}
        >
          renderWithPortal
        </Checkbox>

        <ScreenshotArea>
          <SpaceBetween size="m" direction="horizontal">
            <div style={{ width: 50 }}>
              <Popover id="x1" {...popoverProps}>
                <button>x1</button>
              </Popover>
            </div>

            <div style={{ position: 'relative', width: 50 }}>
              <div style={{ position: 'absolute', left: -10 }}>
                <Popover id="x2" {...popoverProps}>
                  <button>x2</button>
                </Popover>
              </div>
            </div>

            <div style={{ position: 'relative', width: 50 }}>
              <div style={{ contain: 'none', ...{ containerType: 'size' } }}>
                <Popover id="x3" {...popoverProps}>
                  <button>x3</button>
                </Popover>
              </div>
            </div>

            <div style={{ position: 'relative', width: 50 }}>
              <div style={{ contain: 'layout', ...{ containerType: 'size' } }}>
                <Popover id="x4" {...popoverProps}>
                  <button>x4</button>
                </Popover>
              </div>
            </div>

            <div style={{ position: 'relative', width: 50 }}>
              <div style={{ contain: 'none', ...{ containerType: 'inline-size' } }}>
                <Popover id="x5" {...popoverProps}>
                  <button>x5</button>
                </Popover>
              </div>
            </div>

            <div style={{ position: 'relative', width: 50 }}>
              <div style={{ contain: 'layout', ...{ containerType: 'inline-size' } }}>
                <Popover id="x6" {...popoverProps}>
                  <button>x6</button>
                </Popover>
              </div>
            </div>
          </SpaceBetween>
        </ScreenshotArea>
      </SpaceBetween>
    </Box>
  );
}
